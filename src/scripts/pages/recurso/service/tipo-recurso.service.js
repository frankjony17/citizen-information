(function () {

    'use strict';

    angular.module('sdsicApp').factory('TipoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarTipoRecurso() {

            return $http.get(URL_FKSOLUTIONS + "/tipoRecurso");

        }

        return {
            listarTipoRecurso: listarTipoRecurso
        };

    }

})();
