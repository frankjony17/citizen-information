(function () {

    'use strict';

    angular.module('sdsicApp').factory('DevolvePedidoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function devolver(devolvePedidoDTO) {

            return $http.post(URL_FKSOLUTIONS + "/devolvePedido", devolvePedidoDTO);

        }

        function consultarStatusRecurso(idPedido) {

            return $http.get(URL_FKSOLUTIONS + "/devolvePedido/consultarStatusRecurso/" + idPedido);

        }

        return {
            devolver: devolver,
            consultarStatusRecurso: consultarStatusRecurso
        };

    }

})();
