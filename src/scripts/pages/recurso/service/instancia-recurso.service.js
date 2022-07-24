(function () {

    'use strict';

    angular.module('sdsicApp').factory('InstanciaRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarInstanciaRecurso() {

            return $http.get(URL_FKSOLUTIONS + "/instanciaRecurso");

        }

        return {
            listarInstanciaRecurso: listarInstanciaRecurso
        };

    }

})();
