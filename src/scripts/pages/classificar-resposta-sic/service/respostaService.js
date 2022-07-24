(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('RespostaService', service);

    function service($http ) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function buscarResposta(id) {
            return $http.get(URL_FKSOLUTIONS+ '/classificarRespostaSic/buscarRespostaEsic/' + id);
        }

        return{

            buscarResposta : buscarResposta

        }
    }
})();
