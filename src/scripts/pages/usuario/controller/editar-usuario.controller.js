(function () {
    'use strict';
    angular.module('sdsicApp').controller('EditarUsuarioController' , ['$state',  '$stateParams', '$mdToast', '$mdDialog', 'UsuarioService', 'UnidadeService', 'MensagensService', controller]);
    function controller($state, $stateParams,  $mdToast, $mdDialog, UsuarioService, UnidadeService, MensagensService) {
        var vm = this;
        vm.cpf = $stateParams.cpf;
        vm.perfis = true;
        vm.nomePerfil = $stateParams.nomePerfil;
        vm.defaultOrgao = {
            codigoUnidade: "235876",
            nomeUnidade: "Ministério da Economia",
            siglaUnidade: "ME"
        };
        vm.unidadeSIC = {
            id: 1,
            codigoUnidade: "0000",
            nomeUnidade: "SIC",
            siglaUnidade: "",
            statusUnidade: true,
            subunidade: null,
            orgaoSiorg: vm.defaultOrgao
        };
        vm.detalharUsuario = [];
        vm.bloqueiaOrgaoEtc = false;

        init();

        vm.voltar = _voltar;

        vm.loadUnidadesSiorg = function (unidade) {
            if (vm.nomePerfil == "FKSOLUTIONS.ADMIN" || vm.nomePerfil == "FKSOLUTIONS.ATENDENTE.SIC"){
                vm.detalharUsuario.unidade = [{ nomeUnidade: "SIC", id: 1, siglaUnidade: "SIC" }];
            } else{
                UnidadeService.listaUnidadeDataBase(unidade.codigoUnidade).then(function(response) {
                    vm.detalharUsuario.unidade = response.data;
                });
            }
        };

        vm.loadSubUnidadesSiorg = function (unidade) {
            vm.detalharUsuario.subunidades = unidade.subunidade;
            vm.detalharUsuario.unidadeSubunidades = unidade.subunidade;
            loadUsuarioAutoridadeHierarquica(unidade.id);
            loadUsuarioAutoridadeMaxima(unidade.id);
        };

        vm.isValid = function (ev) {
            if (vm.bool) {
                vm.defaultUnidade = vm.detalharUsuario.unidade[0];
            }
            if (!vm.perfis) {
                vm.defaultUnidade = vm.unidadeSIC;
            }
            if (vm.defaultUnidade !== null) {
                salvar(ev,{
                    unidade: vm.defaultUnidade,
                    subunidades: vm.defaultSubunidade,
                    usuario: {
                        id: vm.detalharUsuario.id,
                        nomeUsuario: vm.detalharUsuario.nome,
                        cpfUsuario: vm.detalharUsuario.cpf,
                        codigoUsuario: vm.detalharUsuario.cpf,
                        emailUsuario: vm.detalharUsuario.email,
                        cargoUsuario: vm.detalharUsuario.cargo,
                        funcaoUsuario: vm.detalharUsuario.funcao,
                        telefoneUsuario: vm.detalharUsuario.telefone,
                        perfilUsuario: "", subunidade: null, unidade: null
                    },
                    assinaturaUsuario: vm.detalharUsuario.assinatura,
                    nomePerfil: vm.detalharUsuario.perfil
                });
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
            }
        };

        vm.show = function () {
            var bool = true;
            if (vm.nomePerfil === "FKSOLUTIONS.RESPONDENTE" || vm.nomePerfil === "FKSOLUTIONS.TECNICO"){
                bool = false;
            }
            console.log(bool);
            return bool;
        };

        function detalharUsuario () {
            UsuarioService.detalharUsuario(vm.cpf, vm.nomePerfil).then(function (response) {
                var temp = response.data;
                if (temp.orgao.id === null) {
                    vm.bool = false;
                    listarOrgaoSiorg();
                    temp.orgao = vm.detalharUsuario.orgao;
                } else {
                    vm.bool = true;
                    temp.orgao = [temp.orgao];
                    temp.unidade = [temp.unidade];
                }
                vm.detalharUsuario = temp;
                vm.defaultSubunidade = vm.detalharUsuario.subunidades;
                if (vm.detalharUsuario.perfil === "FKSOLUTIONS.ADMIN" || vm.detalharUsuario.perfil === "FKSOLUTIONS.ATENDENTE.SIC") {
                    vm.perfis = false;
                }
            });
        }

        function listarOrgaoSiorg () {
            if (vm.nomePerfil == "FKSOLUTIONS.ADMIN" || vm.nomePerfil == "FKSOLUTIONS.ATENDENTE.SIC"){
                vm.detalharUsuario.orgao = [{nomeUnidade: "Ministério da Econômia", siglaUnidade:"ME", id:"235876"}];
            } else {
                UnidadeService.listarOrgaoDataBase().then(function(response) {
                    vm.detalharUsuario.orgao = response.data;
                });
            }
        }

        function _voltar () {
            $state.go("consultarUsuario");
        }

        function salvar (ev , dto) {
            UsuarioService.salvar(dto).then(function() {
                MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                $state.go("consultarUsuario");
            });
        }

        function loadUsuarioAutoridadeHierarquica (idUnidade) {
            UsuarioService.buscarUsuarioAutoridadeHierarquicaPorUnidade(idUnidade).then(function(response) {
                vm.detalharUsuario.autoridadeHier = response.data[0].nomeUsuario;
            });
        }

        function loadUsuarioAutoridadeMaxima (idUnidade) {
            UsuarioService.buscarUsuarioAutoridadeMaximaPorUnidade(idUnidade).then(function(response) {
                vm.detalharUsuario.autoridadeMaxi = response.data[0].nomeUsuario;
            });
        }

        function init() {
            detalharUsuario();
        }
    }
})();
