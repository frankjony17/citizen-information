(function () {

    'use strict';

    angular.module('sdsicApp').factory('HistoricoPedidoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarHistoricoPedido(id, offset, limit) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/historicoPedido', {
                params: {
                    id: id,
                    offset: offset,
                    limit: limit
                }
            });
        }

        function buscarRepostaHistorico(id) {
            return $http.get(URL_FKSOLUTIONS + '/historicoTratamento/' + id);
        }

        return {
            consultarHistoricoPedido: consultarHistoricoPedido,
            buscarRepostaHistorico: buscarRepostaHistorico
        };

    }

})();
