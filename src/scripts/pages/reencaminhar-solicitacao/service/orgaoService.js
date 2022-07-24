(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('OrgaoService', service);

    function service($http ) {

        var URL_FKSOLUTIONS = 'sdsic/api/';


        function buscarOrgao() {
            return $http.get(URL_FKSOLUTIONS + 'orgao');
        }

        return{

            buscarOrgao : buscarOrgao
        }
    }
})();
