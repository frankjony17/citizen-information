(function () {

    'use strict';

    angular.module('sdsicApp').factory('StatusTramitacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarStatusTramitacao() {

            return $http.get(URL_FKSOLUTIONS + "/statusTramitacao");

        }

        return {
            listarStatusTramitacao: listarStatusTramitacao
        };

    }

})();
