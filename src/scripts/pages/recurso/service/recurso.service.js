(function () {

    'use strict';

    angular.module('sdsicApp').factory('RecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarRecurso(filtro) {
            return $http.get(URL_FKSOLUTIONS + '/recurso', {
                params: {
                    filtro: filtro
                }
            });
        }

        function consultarDetalheRecurso(idPedido, instanciaRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/' + idPedido + '/' + instanciaRecurso);
        }

        function gerarRelatorioExcel(filtro) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/exportar', {
                params: {
                    filtro: filtro
                }
            });
        }

        function consultarStatusRespostaAssinada(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/consultarStatusRespostaAssinada/' + idRecurso);
        }

        return {
            consultarRecurso: consultarRecurso,
            consultarDetalheRecurso: consultarDetalheRecurso,
            gerarRelatorioExcel: gerarRelatorioExcel,
            consultarStatusRespostaAssinada: consultarStatusRespostaAssinada
        };

    }

})();
