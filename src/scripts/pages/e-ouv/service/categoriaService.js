(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('CategoriaService', service);

    function service($http ) {

        var URL_FKSOLUTIONS = 'sdsic/api';


        function buscarTodasCategorias() {
            return $http.get(URL_FKSOLUTIONS+ '/categoria');
        }

        return{

            buscarTodasCategorias : buscarTodasCategorias

        }
    }
})();
