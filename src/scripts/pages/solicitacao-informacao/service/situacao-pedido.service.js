(function () {

    'use strict';

    angular.module('sdsicApp').factory('SituacaoPedidoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarSituacaoPedido() {

            return $http.get(URL_FKSOLUTIONS + "/situacaoPedido");

        }

        return {
            listarSituacaoPedido: listarSituacaoPedido
        };

    }

})();
