(function () {

    'use strict';

    angular.module('sdsicApp').factory('SituacaoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarSituacaoRecurso() {

            return $http.get(URL_FKSOLUTIONS + "/situacaoRecurso");

        }

        return {
            listarSituacaoRecurso: listarSituacaoRecurso
        };

    }

})();
