(function () {

    'use strict';

    angular.module('sdsicApp').factory('RespostaAssinadaRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function salvarRespostaRecurso(respostaAssinadaRecursoDTO) {
            return $http.post(URL_FKSOLUTIONS + "/respostaAssinadaRecurso/salvarRespostaRecurso", respostaAssinadaRecursoDTO)
        }

        function buscarRespostaRecurso(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/respostaAssinadaRecurso/buscarRespostaRecurso/' + idRecurso);
        }

        return {
            salvarRespostaRecurso: salvarRespostaRecurso,
            buscarRespostaRecurso: buscarRespostaRecurso
        };

    }

})();
