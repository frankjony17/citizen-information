(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('TipoRespostaService', service);

    function service($http ) {

        var URL_FKSOLUTIONS = 'sdsic/api';


        function buscarTodosTiposResposta() {
            return $http.get(URL_FKSOLUTIONS+ '/tipoResposta');
        }

        return{

            buscarTodosTiposResposta : buscarTodosTiposResposta

        }
    }
})();
