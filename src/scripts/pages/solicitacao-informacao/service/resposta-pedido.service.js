(function () {

    'use strict';

    angular.module('sdsicApp').factory('RespostaPedidoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function salvarResposta(respostaPedidoDTO) {
            return $http.post(URL_FKSOLUTIONS + '/pedido/respostaPedido', respostaPedidoDTO);
        }

        function cancelarResposta(id) {
            return $http.delete(URL_FKSOLUTIONS + '/pedido/cancelarResposta/' + id);
        }

        function buscarRespostaPedido(id) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/buscarRespostaPedido/' + id);
        }

        function buscarRespostaSdsicSalva(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/propostaResposta/buscarRespostaSdsicSalva/' + idPedido);
        }

        function obterAssinatura(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/propostaResposta/obterAssinatura/' + idPedido);
        }

        return {
            salvarResposta: salvarResposta,
            cancelarResposta: cancelarResposta,
            buscarRespostaPedido: buscarRespostaPedido,
            buscarRespostaSdsicSalva: buscarRespostaSdsicSalva,
            obterAssinatura: obterAssinatura
        };

    }

})();
