(function () {

    'use strict';

    angular.module('sdsicApp').factory('StatusSolicitacaoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarStatusSolicitacao() {

            return $http.get(URL_FKSOLUTIONS + "/statusSolicitacaoRecurso");

        }

        return {
            listarStatusSolicitacao: listarStatusSolicitacao
        };

    }

})();
