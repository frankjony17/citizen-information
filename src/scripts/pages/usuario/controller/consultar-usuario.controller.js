(function () {
    'use strict';
    angular.module('sdsicApp').controller('ConsultarUsuarioController' , ['$location', '$element', '$state', '$mdToast', '$mdDialog', '$log', '$window', '$parse', 'UsuarioService', 'MensagensService','UnidadeService', controller]);
    function controller($element, $location, $state, $mdToast, $mdDialog, $log, $window, $parse, UsuarioService, MensagensService, UnidadeService) {
        var vm = this;
        vm.searchTerm;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        vm.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0,
            finalPage: 0
        };
        vm.filtroUsuarioDTO = {
            offset: null,
            limit: null,
            cpfUsuario: null,
            nomePerfil: null,
            idUnidade: null,
            idsSubunidade: null,
            statusUsuario: null,
            dataQuery: null
        };
        vm.statusUsuario = [
            { nome: 'Ativo' },
            { nome: 'Inativo' },
            { nome: 'Usuario Não Encontrado No Acessos' }
        ];
        vm.listaSubunidades = [];
        vm.listaUnidade = [];
        vm.usuario = {};
        vm.listaPerfil = [];
        vm.listaUsuario = [];
        vm.listaConsultaUsuario = [];
        vm.unidade = null;
        vm.subunidades = null;

        init();

        vm.limpar = _limpar;
        vm.buscar = _buscar;
        vm.editarUsuario = _editarUsuario;
        vm.detalharUsuario = _detalharUsuario;

        vm.loadSubunidade = function (unidade) {
            vm.listaSubunidades = unidade.subunidade;
        };

        vm.atualizaPerfil = function (cpf, perfil, $even) {
            var titulo = "Deseja inativar este perfil do usuário?",
                mensagem = "";
            if (!status) {
                $mdDialog.show(MensagensService.dialogoConfirmacao(titulo, mensagem, $even)).then(function () {
                    sessionStorage.removeItem("usuarios-combo-data");
                    salvarStatus(cpf, perfil);
                }, function () {
                    _buscar();
                });
            } else {
                sessionStorage.removeItem("usuarios-combo-data");
                salvarStatus(cpf, perfil);
            }
        };

        vm.getSubunidades = function (unidade, sub) {
            var subunidades = "";
            angular.forEach(sub, function (item) {
                item != null ? subunidades += item.nomeSubunidade +", " : null;
            });
            subunidades = subunidades === "" ? "Sem atribuição." : subunidades.slice(0, -2).concat(".");
            return unidade === "SIC" ? subunidades = "-" : subunidades;
        };

        vm.buscarAll = function () {
            vm.filtroUsuarioDTO.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.filtroUsuarioDTO.limit = angular.copy(vm.tabelaConsulta.limit);
            vm.filtroUsuarioDTO.cpfUsuario = vm.usuario != null || vm.usuario !== {} ? vm.usuario.cpf : null;
            vm.filtroUsuarioDTO.idUnidade = vm.unidade != null ? vm.unidade.id : null;
            vm.filtroUsuarioDTO.idsSubunidade = vm.subunidades != null ? vm.subunidades.idSubunidade : null;

            UsuarioService.consultarUsuario(vm.filtroUsuarioDTO).then(function (sucess) {
                vm.listaConsultaUsuario = sucess.data.resultado;
                vm.totalElementosConsulta = sucess.data.totalElementos;
            });
        };

        function salvarStatus(cpf, perfil) {
            UsuarioService.atualizaPerfilUsuario(cpf, perfil).then(function (resposta) {
                if (resposta.data === "autoridade_sem_substituto") {
                    MensagensService.dialogoAlerta("", "Não é possível realizar a inativação desse usuário, pois o mesmo está definido como autoridade sem substituto na sua Unidade.");
                    _buscar();
                } else {
                    $log.log(resposta.data);
                    _buscar();
                }
            }, function () {
                _buscar();
            });
        }

        function buscarTodasUnidades() {
            UnidadeService.buscarListaUnidade().then(
                function (sucess) {
                    vm.listaUnidade = sucess.data;
                }
            );
            _limpar();
        }

        function _detalharUsuario (cpfUsuario, nomePerfil) {
            $state.go("detalharUsuario",{cpf: cpfUsuario, nomePerfil: nomePerfil})
        }

        function _editarUsuario (cpfUsuario, nomePerfil) {
            sessionStorage.removeItem("usuarios-combo-data");
            $state.go("editarUsuario", {cpf: cpfUsuario, nomePerfil: nomePerfil});
        }
        
        function _buscar() {
            var dataOld = JSON.parse(sessionStorage.getItem("usuarios-combo-data")) != null ? new Date(JSON.parse(sessionStorage.getItem("usuarios-combo-data"))) : null;
            var minutes = dataOld !== null ? new Date(dataOld.getTime() + (30 * 60 * 1e3)).getMinutes() : 30;
            var date = new Date();
            if (dataOld === null || ((date.getMinutes() >= minutes && date.getHours() === dataOld.getHours()) || (date.getMinutes() >= minutes && date.getHours() > dataOld.getHours()))) {
                UsuarioService.obterTodosUsuarios().then(function () {
                    sessionStorage.setItem("usuarios-combo-data", angular.toJson(new Date()));
                    vm.buscarAll();
                });
            } else {
                vm.buscarAll();
            }
        }

        function _limpar() {
            vm.nomeUnidade = null;
            vm.usuario = {};
            vm.name = null;
            vm.filtroUsuarioDTO = {
                offset: null,
                limit: null,
                nomePerfil:  null,
                nomeUnidade: null,
                idUsuario: null,
                cpfUsuario: null
            };

        }

        function carregarPerfis() {
            UsuarioService.buscarTodosPerfis().then(function (response) {
                vm.listaPerfil = response.data;
            });
        }

        function _carregarUsuarios() {
            vm.listaUsuario = JSON.parse(sessionStorage.getItem("usuarios-acesso"));
            if (vm.listaUsuario === null) {
                UsuarioService.buscarTodosUsuarios().then(function (sucess) {
                    vm.listaUsuario = sucess.data;
                    sessionStorage.setItem("usuarios-acesso", angular.toJson(vm.listaUsuario));
                });
            }
        }

        function init() {
            carregarPerfis();
            _carregarUsuarios();
            buscarTodasUnidades();
        }
    }
})();
