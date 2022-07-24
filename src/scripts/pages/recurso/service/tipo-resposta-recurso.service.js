(function () {

    'use strict';

    angular.module('sdsicApp').factory('TipoRespostaRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarTipoResposta() {

            return $http.get(URL_FKSOLUTIONS + "/tipoRespostaRecurso");

        }

        return {
            listarTipoResposta: listarTipoResposta
        };

    }

})();
