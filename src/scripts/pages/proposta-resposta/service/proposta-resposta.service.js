(function () {

    'use strict';

    angular.module('sdsicApp').factory('PropostaRespostaService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function enviar(propostaRespostaDTO) {

            return $http.post(URL_FKSOLUTIONS + "/propostaResposta", propostaRespostaDTO);

        }

        function excluirRespostaSdsic(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/propostaResposta/excluirRespostaSdsic/' + idPedido);
        }

        function buscarDadosEncaminhamento(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/propostaResposta/buscarDadosEncaminhamento/' + idPedido);
        }

        return {
            enviar: enviar,
            excluirRespostaSdsic: excluirRespostaSdsic,
            buscarDadosEncaminhamento: buscarDadosEncaminhamento
        };

    }

})();
