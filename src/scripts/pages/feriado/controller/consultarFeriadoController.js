(function () {
    'use strict';

    angular.module('sdsicApp').controller('ConsultarFeriadoController' , ['$rootScope','$mdDialog','$state','FeriadoService', 'MensagensService','$mdToast', '$log', controller]);
    function controller($rootScope ,$mdDialog,$state, FeriadoService, MensagensService, $mdToast, $log) {

        var vm = this;

        vm.consultarFeriado = {
            id: undefined,
            offset: undefined,
            limit: undefined,
            periodoInicialFeriado: undefined,
            periodoFinalFeriado: undefined,
            ano: undefined
        };

        vm.dataAtual = new Date();

        vm.isDetalhar = undefined;

        vm.consultarFeriadoRealizada = {};

        vm.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        vm.listaConsultaFeriadoDTO = [];

        vm.totalConsulta = undefined;

        vm.totalPaginasConsulta = undefined;

        vm.consultar = consultar;
        vm.irParaCadastrar = irParaCadastrar;
        vm.limpar = limpar;

        function limpar() {
            vm.consultarFeriado = {
                offset: undefined,
                limit: undefined,
                periodoInicialFeriado: undefined,
                periodoFinalFeriado: undefined,
                ano: undefined
            };
        }

        function limparTabela() {
            vm.listaConsultaFeriadoDTO = [];
            vm.totalConsulta = undefined;
            vm.totalPaginasConsulta = undefined;
        }


        function consultar() {
            vm.consultarFeriado.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.consultarFeriado.limit = angular.copy(vm.tabelaConsulta.limit);
            if(vm.consultarFeriado.periodoInicialFeriado > vm.consultarFeriado.periodoFinalFeriado ){
                MensagensService.exibirMensagemErro("O período informado não é válido");
                return;
            }
            FeriadoService.consultarFeriado(vm.consultarFeriado).then(
                function (successResponse) {
                    if(successResponse.data && successResponse.data.resultado && successResponse.data.resultado.length > 0) {
                        vm.listaConsultaFeriadoDTO = successResponse.data.resultado;
                        vm.totalElementosConsulta = successResponse.data.totalElementos;
                        vm.totalPaginasConsulta = successResponse.data.totalPaginas;
                        vm.consultarFeriadoRealizada = angular.copy(vm.consultarFeriado);
                    } else {
                        limparTabela();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Nenhum resultado encontrado.")
                                .hideDelay(3000)
                        );
                    }
                },
                function (errorResponse) {
                    limparTabela();
                    if(errorResponse.data && errorResponse.data.erros && errorResponse.data.erros.length > 0) {
                        for(var i = 0; i < errorResponse.data.erros.length; i++) {
                            var erro = errorResponse.data.erros[i];
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(erro)
                                    .hideDelay(3000)
                            );
                        }
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Ocorreu um erro não esperado ao realizar a consulta de feriados.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }
                }
            );
        }


        vm.deletar = function (id, ev) {
            var confirm = $mdDialog.confirm()
                .title( 'Remover feriado')
                .textContent('Deseja realmente excluir o feriado?')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');
            $mdDialog.show(confirm).then(function() {
                FeriadoService.deletarFeriado(id).then(
                    function (response) {
                        var indice;
                        for (var i = 0; i < vm.listaConsultaFeriadoDTO.length; i++) {
                            vm.cadastroFeriado = response.data;
                            indice = i;
                            break;
                        }
                        vm.listaConsultaFeriadoDTO.splice(indice, 1);
                        MensagensService.exibirMensagemSucesso("Feriado excluído com sucesso.");
                    }
                )

            })

        };

        vm.validaData = function(data){
            return vm.dataAtual > data;
        };

        vm.irEditar = function(id, isDetalhar) {
            $state.go("editarFeriado", {id: id, isDetalhar: isDetalhar});

        };

        function irParaCadastrar() {
            $state.go("cadastrarFeriado");

        }
    }

})();
