(function () {

    'use strict';

    angular.module('sdsicApp').factory('EntregarRespostaService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function entregarResposta(idPedido) {

            return $http.get(URL_FKSOLUTIONS + 'pedido/entregarResposta/' + idPedido);
        }
        return {
            entregarResposta : entregarResposta
        };

    }

})();
