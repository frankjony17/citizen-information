(function () {

    'use strict';

    angular.module('sdsicApp').factory('DevolverRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function devolver(devolvePedidoDTO) {

            return $http.post(URL_FKSOLUTIONS + "/devolveRecurso", devolvePedidoDTO);

        }

        function consultarStatusRecurso(idRecurso) {

            return $http.get(URL_FKSOLUTIONS + "/devolveRecurso/consultarStatusRecurso/" + idRecurso);

        }

        return {
            devolver: devolver,
            consultarStatusRecurso: consultarStatusRecurso
        };

    }

})();
