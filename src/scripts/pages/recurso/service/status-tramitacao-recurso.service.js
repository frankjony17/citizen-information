(function () {

    'use strict';

    angular.module('sdsicApp').factory('StatusTramitacaoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarStatusTramitacao() {

            return $http.get(URL_FKSOLUTIONS + "/statusTramitacaoRecurso");

        }

        return {
            listarStatusTramitacao: listarStatusTramitacao
        };

    }

})();
