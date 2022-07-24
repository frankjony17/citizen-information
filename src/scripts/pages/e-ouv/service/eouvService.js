(function () {

    'use strict';

    angular.module('sdsicApp').factory('EouvService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function salvarStatus(eouv) {

            return $http.post(URL_FKSOLUTIONS + 'eouv', eouv);
        }

        function buscarPalavraChave(idPedido) {
            return $http.get(URL_FKSOLUTIONS + 'eouv/buscarPalavraChavePedido/' + idPedido);
        }

        return {
            salvarStatus : salvarStatus,
            buscarPalavraChave : buscarPalavraChave
        };
    }

})();
