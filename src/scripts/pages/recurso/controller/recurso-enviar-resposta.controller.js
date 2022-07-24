(function () {

    'use strict';

    angular.module('sdsicApp').controller('RespostaRecursoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', 'MensagensService', 'RespostaRecursoService', 'UnidadeService', 'PropostaRespostaRecursoService', 'EscopoCompartilhadoPedidoDuplicadoService', controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $stateParams, MensagensService, RespostaRecursoService, UnidadeService, PropostaRespostaRecursoService, EscopoCompartilhadoPedidoDuplicadoService) {

        var vm = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        vm.idRecurso = $stateParams.id;

        vm.nomeStatusSolicitacao = undefined;

        vm.respostaRecursoDTO = {
            idRecurso: undefined,
            observacao: undefined,
            idStatusSolicitacao: undefined,
            nomeStatusSolicitacao: undefined,
            idUnidade: undefined
        };

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.enviar = _enviar;

        vm.voltar = _voltar;

        vm.statusSolicitacaoRecurso = {};

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            buscarListaUnidade();
            buscarIdPedido();
            buscarUltimaUnidade();
            verificarAndamentoRecurso();
        }

        function verificarAndamentoRecurso() {
            RespostaRecursoService.verificarAndamentoRecurso(vm.idRecurso).then(
                function (response) {
                    vm.ultimoStatusSolicitacao = response.data;
                    consultarStatusRecurso();
                }
            )
        }



        function buscarListaUnidade() {
            UnidadeService.buscarListaUnidade().then(
                function (successResponse) {
                    vm.listaUnidade = successResponse.data;
                }
            );
        }

        function buscarUltimaUnidade() {
            PropostaRespostaRecursoService.buscarIdPedido(vm.idRecurso).then(
                function (successResponse) {
                    vm.idPedido = successResponse.data;
                    PropostaRespostaRecursoService.buscarUltimaUnidade(vm.idPedido).then(
                        function (sucess) {
                            vm.ultimaUnidade = sucess.data;
                        }
                    )
                }
            );
        }

        function buscarIdPedido() {
            PropostaRespostaRecursoService.buscarIdPedido(vm.idRecurso).then(
                function (successResponse) {
                    vm.idPedido = successResponse.data;
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _enviar() {
            if(vm.respostaRecursoForm.$valid) {
                vm.respostaRecursoDTO.idRecurso = vm.idRecurso;
                RespostaRecursoService.enviar(vm.respostaRecursoDTO).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Recurso enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido : vm.idPedido});
                    },
                    function (errorResponse) {
                        if (errorResponse.data && errorResponse.data.errorMessage) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(errorResponse.data.errorMessage)
                                    .hideDelay(3000)
                            );
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("Ocorreu um erro não esperado ao enviar o recurso.")
                                    .hideDelay(3000)
                            );
                        }
                    }
                );
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.respostaRespostaForm.$setSubmitted();
            }

        }

        function consultarStatusRecurso () {
            RespostaRecursoService.consultarStatusRecurso(vm.idRecurso).then(
                function (response) {
                    vm.statusSolicitacaoRecurso = response.data;
                    vm.respostaRecursoDTO.idStatusSolicitacao = vm.statusSolicitacaoRecurso.id;
                    vm.respostaRecursoDTO.nomeStatusSolicitacao = vm.statusSolicitacaoRecurso.nome;
                    if(vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Distribuição PF") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 1ª Respondido";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 5;
                        vm.tituloPagina = "Enviar Resposta";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Produção" && vm.ultimoStatusSolicitacao != 1) {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 1ª Assinado";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 4;
                        vm.tituloPagina = "Enviar Recurso";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Respondido") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 1ª Para Revisão";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 6;
                        vm.tituloPagina = "Enviar Recurso";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Para Envio") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 1ª Enviado";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 8;
                        vm.tituloPagina = "Enviar e-SIC";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Assinado" ||vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 1ª Produção" && vm.ultimoStatusSolicitacao == 1 ) {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 1ª Respondido";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 5;
                        vm.tituloPagina = "Enviar Recurso";
                    }
                    if(vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 2ª Distribuição PF") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 2ª Respondido";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 13;
                        vm.tituloPagina = "Enviar Resposta";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 2ª Produção") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 2ª Assinado";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 12;
                        vm.tituloPagina = "Enviar Recurso";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 2ª Respondido") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 2ª Para Revisão";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 14;
                        vm.tituloPagina = "Enviar Recurso";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 2ª Para Envio") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 2ª Enviado";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 16;
                        vm.tituloPagina = "Enviar e-SIC";
                    } else if (vm.respostaRecursoDTO.nomeStatusSolicitacao == "Recurso 2ª Assinado") {
                        vm.respostaRecursoDTO.nomeStatusSolicitacao = "Recurso 2ª Respondido";
                        vm.respostaRecursoDTO.idStatusSolicitacao = 13;
                        vm.tituloPagina = "Enviar Recurso";
                    }

                }
            )
        }

        function _voltar() {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        }
    }

})();
