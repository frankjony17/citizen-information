(function () {

    'use strict';

    angular.module('sdsicApp').factory('PropostaRespostaRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function enviar(propostaRespostaRecursoDTO) {

            return $http.post(URL_FKSOLUTIONS + "/propostaRespostaRecurso", propostaRespostaRecursoDTO);
        }

        function buscarStatusSolicitacao(id) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/buscarStatusSolicitacaoPorRecurso/' + id);
        }

        function salvarPropostaRespostaRecurso(propostaResposta, idRecurso) {
            var PropostaResposta = {propostaResposta: propostaResposta, idRecurso: idRecurso};
            return $http.post(URL_FKSOLUTIONS + "/propostaRespostaRecurso/salvar", PropostaResposta)
        }

        function buscarRespostaRecurso(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/propostaRespostaRecurso/buscarRespostaRecurso/' + idRecurso);
        }

        function excluirRespostaSdsic(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/propostaRespostaRecurso/excluirRespostaRecurso/' + idRecurso);
        }
        function buscarInstanciaRecurso(id) {
            return $http.get(URL_FKSOLUTIONS + '/propostaRespostaRecurso/buscarInstanciaRecurso/' + id);
        }

        function buscarIdPedido(idRecurso) {
            return $http.get(URL_FKSOLUTIONS + '/recurso/buscarIdPedido/' + idRecurso);
        }

        function buscarUltimaUnidade(id) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/buscarUltimaUnidade/' + id);

        }

        function buscarUsuario(id) {
            return $http.get(URL_FKSOLUTIONS + '/andamentoRecurso/buscarUsuario/' + id);
        }

        return {
            enviar: enviar,
            buscarStatusSolicitacao: buscarStatusSolicitacao,
            salvarPropostaRespostaRecurso: salvarPropostaRespostaRecurso,
            buscarRespostaRecurso: buscarRespostaRecurso,
            excluirRespostaSdsic: excluirRespostaSdsic,
            buscarIdPedido: buscarIdPedido,
            buscarUltimaUnidade: buscarUltimaUnidade,
            buscarInstanciaRecurso: buscarInstanciaRecurso,
            buscarUsuario: buscarUsuario

        };

    }

})();
