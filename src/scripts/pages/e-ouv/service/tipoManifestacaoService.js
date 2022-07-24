(function () {

    'use strict';

    angular.module('sdsicApp').factory('TipoManifestacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function buscarNomeTipoManifestacao() {
            return $http.get(URL_FKSOLUTIONS + '/tipoManifestacao');
        }
        return {
            buscarNomeTipoManifestacao : buscarNomeTipoManifestacao
        };

    }

})();
