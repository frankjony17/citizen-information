(function () {

    'use strict';

    angular.module('sdsicApp').factory('MotivoProrrogacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarMotivoProrrogacao() {

            return $http.get(URL_FKSOLUTIONS + "/motivoProrrogacao");

        }

        return {
            listarMotivoProrrogacao: listarMotivoProrrogacao
        };

    }

})();
