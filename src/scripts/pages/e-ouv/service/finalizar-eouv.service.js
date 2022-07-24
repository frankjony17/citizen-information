(function () {

    'use strict';

    angular.module('sdsicApp').factory('FinalizarEouvService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function finalizarEouv(idPedido) {

            return $http.get(URL_FKSOLUTIONS + 'eouv/finalizarEouv/' + idPedido);
        }
        return {
            finalizarEouv : finalizarEouv
        };

    }

})();
