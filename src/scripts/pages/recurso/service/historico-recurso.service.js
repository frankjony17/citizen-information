(function () {

    'use strict';

    angular.module('sdsicApp').factory('HistoricoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarHistoricoRecurso(id, offset, limit) {
            return $http.get(URL_FKSOLUTIONS + '/historicoTratamentoRecurso/consultarHistoricoRecurso', {
                params: {
                    id: id,
                    offset: offset,
                    limit: limit
                }
            });
        }

        function buscarRespostaHistorico(id) {
            return $http.get(URL_FKSOLUTIONS + '/historicoTratamentoRecurso/' + id);
        }

        function consultarDataRespostaRecurso(id) {
            return $http.get(URL_FKSOLUTIONS + '/historicoTratamentoRecurso/consultarDataRespostaRecurso/' + id);
        }

        return {
            consultarHistoricoRecurso: consultarHistoricoRecurso,
            buscarRespostaHistorico: buscarRespostaHistorico,
            consultarDataRespostaRecurso: consultarDataRespostaRecurso
        };

    }

})();
