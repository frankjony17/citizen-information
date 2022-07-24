(function () {

    'use strict';

    angular.module('sdsicApp').factory('ProrrogarPrazoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function salvarProrrogacao(prorrogacao) {
            return $http.post(URL_FKSOLUTIONS + 'prorrogacao', prorrogacao);
        }

        function consultarProrrogacao(idPedido) {
            return $http.get(URL_FKSOLUTIONS + 'prorrogacao/' + idPedido)

        }

        function consultarProrrogacaoEsic(idPedido) {
            return $http.get(URL_FKSOLUTIONS + 'prorrogacao/consultarProrrogacaoEsic/' + idPedido)
        }

        return {
            salvarProrrogacao : salvarProrrogacao,
            consultarProrrogacao : consultarProrrogacao,
            consultarProrrogacaoEsic : consultarProrrogacaoEsic
        };

    }

})();
