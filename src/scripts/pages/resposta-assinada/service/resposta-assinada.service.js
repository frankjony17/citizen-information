(function () {

    'use strict';

    angular.module('sdsicApp').factory('RespostaAssinadaService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function enviar(respostaAssinadaDTO) {

            return $http.post(URL_FKSOLUTIONS + "/respostaAssinada", respostaAssinadaDTO);
        }

        function salvar(propostaResposta, idPedido) {
            var PropostaResposta = {propostaResposta: propostaResposta, idPedido: idPedido};
            return $http.post(URL_FKSOLUTIONS + "/respostaAssinada/salvar", PropostaResposta)

        }

        function buscarResposta(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/respostaAssinada/buscarResposta/' + idPedido);
        }

        function editarResposta(editarResposta) {
            return $http.post(URL_FKSOLUTIONS + '/respostaAssinada/editarResposta/', editarResposta)
        }

        function buscarDadosEncaminhamento(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/respostaAssinada/buscarDadosEncaminhamento/' + idPedido)
        }

        return {
            editarResposta: editarResposta,
            enviar: enviar,
            salvar: salvar,
            buscarResposta: buscarResposta,
            buscarDadosEncaminhamento: buscarDadosEncaminhamento
        };

    }

})();
