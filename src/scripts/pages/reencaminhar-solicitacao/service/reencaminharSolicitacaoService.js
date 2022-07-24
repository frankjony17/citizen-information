(function () {

    'use strict';

    angular.module('sdsicApp').factory('ReencaminharSolicitacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function salvarReencaminharSolicitacao(reencaminharSolicitacao) {
            return $http.post(URL_FKSOLUTIONS + "reencaminharSolicitacao", reencaminharSolicitacao);
        }

        function buscarReencaminhamentoParaOrgao(idPedido) {
            return $http.get(URL_FKSOLUTIONS + "/reencaminharSolicitacao/buscarReencaminhamentoParaOrgao/" + idPedido);
        }

        return {
            salvarReencaminharSolicitacao: salvarReencaminharSolicitacao,
            buscarReencaminhamentoParaOrgao: buscarReencaminhamentoParaOrgao
        };

    }

})();
