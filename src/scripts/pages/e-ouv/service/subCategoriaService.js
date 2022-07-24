(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('SubCategoriaService', service);

    function service($http ) {

        var URL_FKSOLUTIONS = 'sdsic/api';


        function buscarTodasSubcategorias() {
            return $http.get(URL_FKSOLUTIONS+ '/subCategoria');
        }

        function  buscarPorCategoria(id) {
            return $http.get(URL_FKSOLUTIONS+ '/subCategoria/porCategoria/' + id);

        }

        return{

            buscarTodasSubcategorias : buscarTodasSubcategorias,
            buscarPorCategoria : buscarPorCategoria
        }
    }
})();
