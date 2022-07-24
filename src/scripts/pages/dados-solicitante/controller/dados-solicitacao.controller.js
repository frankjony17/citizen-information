(function () {
    'use strict';
    angular.module('sdsicApp').controller('DadosSolicitacaoController', ['$stateParams', '$state', 'SolicitacaoInformacaoService', 'RecursoService', 'EscopoCompartilhadoPedidoDuplicadoService', controller]);

    function controller($stateParams, $state, SolicitacaoInformacaoService, RecursoService, EscopoCompartilhadoPedidoDuplicadoService) {
        var scope = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        scope.consulta = $stateParams.consulta;
        scope.id = $stateParams.id;
        scope.instancia = $stateParams.instancia;
        scope.pedidoDetalhadoDTO = {};

        // Declaração de metodos publicos-------------------------------------------------------------------------------
        scope.voltar = function () {
            if (scope.consulta === "pedido") {
                EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                $state.go("detalheSolicitacaoInformacao", {idPedido: scope.id});
            }
            else if (scope.consulta === "recurso") {
                EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                $state.go("detalheSolicitacaoInformacao", {idPedido: scope.id});
            }
            else if (scope.consulta === "prorrogaPedido") {
                EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                $state.go("prorrogaPedidoInformacao", { idPedido: scope.id });
            }
        };

        // Inicialização da controller----------------------------------------------------------------------------------
        init();

        // Implementação de metodos privados----------------------------------------------------------------------------
        function init() {
            _carregarPedidoDetalhado();
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------
        function _carregarPedidoDetalhado() {
            if (scope.consulta === "pedido" || scope.consulta === "prorrogaPedido") {
                SolicitacaoInformacaoService.consultarPedidoDetalhado(scope.id).then(function (successResponse) {
                        scope.pedidoDetalhadoDTO = successResponse.data;
                });
            }
            else if (scope.consulta === "recurso") {
                RecursoService.consultarDetalheRecurso(scope.id, scope.instancia).then(function (successResponse) {
                    scope.pedidoDetalhadoDTO = successResponse.data;
                });
            }
        }
    }

})();
