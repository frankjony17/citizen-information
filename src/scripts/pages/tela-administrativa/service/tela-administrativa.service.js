(function () {

    'use strict';

    angular.module('sdsicApp').factory('TelaAdministrativaService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';


        function buscarPeloProtocoloService(protocolo) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/telaAdministrativa',{
                params: {
                    protocolo: protocolo
                }
            });
        }

        function definirStatusPedido(status) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/buscarStatusPedido',{
                params: {
                    status: status
                }
            });
        }

        function definirStatusRecurso(status, id) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/buscarStatusRecurso', {
                params: {
                    status: status,
                    id: id
                }
            });
        }

        function alterarPedidoRecurso(alteracaoPedidoRecursoDTO) {
            return $http.post(URL_FKSOLUTIONS + "/pedido/alterarPedidoRecurso", alteracaoPedidoRecursoDTO);
        }

        return {
            buscarPeloProtocoloService: buscarPeloProtocoloService,
            definirStatusPedido: definirStatusPedido,
            definirStatusRecurso: definirStatusRecurso,
            alterarPedidoRecurso: alterarPedidoRecurso
        };

    }

})();
