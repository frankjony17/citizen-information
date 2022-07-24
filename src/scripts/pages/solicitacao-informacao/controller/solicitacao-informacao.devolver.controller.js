(function () {

    'use strict';

    angular.module('sdsicApp').controller('DevolverPedidoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', 'SolicitacaoInformacaoService', 'DevolvePedidoService', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $stateParams, SolicitacaoInformacaoService, DevolvePedidoService, EscopoCompartilhadoPedidoDuplicadoService, MensagensService) {

        var scope = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        scope.idPedido = $stateParams.idPedido;

        scope.pedidoDetalhadoDTO = {};

        scope.devolvePedidoDTO = {
            idPedido: undefined,
            justificativa: undefined,
            idStatusTramitacao: undefined,
        };

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        scope.devolver = _devolver;

        scope.voltar = _voltar;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            consultarStatusRecurso();
        }

        function consultarStatusRecurso() {
            DevolvePedidoService.consultarStatusRecurso(scope.idPedido).then(
                function (successResponse) {
                    scope.devolvePedidoDTO = successResponse.data;
                }
            );
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _devolver() {
            if($scope.formulario.$valid) {
                scope.devolvePedidoDTO.idPedido = scope.idPedido;
                DevolvePedidoService.devolver(scope.devolvePedidoDTO).then(
                    function () {
                        MensagensService.exibirMensagemSucesso("O pedido de informação foi devolvido com sucesso.");
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
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
                                    .textContent("Ocorreu um erro não esperado ao devolver o pedido de informação.")
                                    .hideDelay(3000)
                            );
                        }
                    }
                );
            } else {
                    if($scope.formulario.textJusticafiva.$error.minlength){
                        MensagensService.exibirmensagemQuantidadeCaracteres();
                    }else{
                        MensagensService.exibirMensagemCamposObrigatorios();
                    }



                $scope.formulario.$setSubmitted();
            }

        }
        function _voltar() {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
        }

        // Implementação de metodos observadores------------------------------------------------------------------------
    }

})();
