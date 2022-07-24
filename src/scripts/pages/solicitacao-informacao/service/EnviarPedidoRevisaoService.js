(function () {

    'use strict';

    angular.module('sdsicApp').factory('EnviarPedidoRevisaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function enviarPedidoRevisao(idPedido) {

            return $http.get(URL_FKSOLUTIONS + 'pedido/enviarPedidoRevisao/' + idPedido);
        }
        return {
            enviarPedidoRevisao : enviarPedidoRevisao
        };

    }

})();
