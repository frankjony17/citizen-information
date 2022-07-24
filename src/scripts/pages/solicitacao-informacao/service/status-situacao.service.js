(function () {

    'use strict';

    angular.module('sdsicApp').factory('StatusSituacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarStatusSituacao() {

            return $http.get(URL_FKSOLUTIONS + "/statusSituacao");

        }

        return {
            listarStatusSituacao: listarStatusSituacao
        };

    }

})();
