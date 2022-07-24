(function () {

    'use strict';

    angular.module('sdsicApp').factory('StatusSolicitacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarStatusSolicitacao() {

            return $http.get(URL_FKSOLUTIONS + "/statusSolicitacao");

        }

        return {
            listarStatusSolicitacao: listarStatusSolicitacao
        };

    }

})();
