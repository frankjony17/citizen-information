(function () {
    'use strict';
    angular.module('sdsicApp').factory('TipoClassificacaoRespostaService', service);
    function service($http) {
        var URL_FKSOLUTIONS = 'sdsic/api/';

        function buscarTipoClassificacaoResposta() {
            return $http.get(URL_FKSOLUTIONS + '/tipoClassificacaoResposta');
        }

        return{
            buscarTipoClassificacaoResposta : buscarTipoClassificacaoResposta
        };
    }


})();
