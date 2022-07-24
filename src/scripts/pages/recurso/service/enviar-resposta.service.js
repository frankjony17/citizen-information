(function () {

    'use strict';

    angular.module('sdsicApp').factory('RespostaRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function enviar(respostaRecursoDTO) {
            return $http.post(URL_FKSOLUTIONS + "/respostaRecurso", respostaRecursoDTO);
        }

        function consultarStatusRecurso(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/buscarStatusSolicitacaoPorRecurso/' + idRecurso);
        }

        function verificarAndamentoRecurso(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/respostaRecurso/verificarAndamento/' + idRecurso);
        }

        return {
            enviar: enviar,
            consultarStatusRecurso: consultarStatusRecurso,
            verificarAndamentoRecurso: verificarAndamentoRecurso
        };

    }

})();
