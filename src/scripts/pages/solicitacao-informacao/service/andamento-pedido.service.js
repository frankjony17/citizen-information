(function () {

    'use strict';

    angular.module('sdsicApp').factory('AndamentoPedidoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarAndamentoPedido(id, offset, limit) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/andamentoPedido', {
                params: {
                    id: id,
                    offset: offset,
                    limit: limit
                }
            });
        }

        return {
            consultarAndamentoPedido: consultarAndamentoPedido
        };

    }

})();
