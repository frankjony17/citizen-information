(function () {
    'use strict';

    angular
        .module('sdsicApp')
        .factory('ClassificacaoTipoRespostaService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';


        function buscarPorTipoResposta(id) {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoTipoResposta/buscarPorTipoResposta/' + id);

        }

        function salvarClassificacaoRespostaSic(classificacaoRespostaSic) {
            return $http.post(URL_FKSOLUTIONS + '/classificarRespostaSic/salvar/', classificacaoRespostaSic)
        }

        function verificaSePossuiClassificacaoRespostaESic(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/classificarRespostaSic/verificaSePossuiClassificacaoRespostaESic/' + idPedido);
        }

        function buscarClassificacaoRespostaESic(id) {
            return $http.get(URL_FKSOLUTIONS + '/classificarRespostaSic/buscarClassificacaoRespostaESic/' + id);
        }

        return {

            buscarPorTipoResposta: buscarPorTipoResposta,
            salvarClassificacaoRespostaSic: salvarClassificacaoRespostaSic,
            verificaSePossuiClassificacaoRespostaESic: verificaSePossuiClassificacaoRespostaESic,
            buscarClassificacaoRespostaESic: buscarClassificacaoRespostaESic

        }
    }
})();
