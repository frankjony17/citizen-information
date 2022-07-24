(function () {
    'use strict';
    angular.module('sdsicApp').factory('ClassificacaoRespostaService', service);
    function service($http) {
        var URL_FKSOLUTIONS = 'sdsic/api/';

        function salvarClassificacaoResposta(cadastrarClassificacaoResposta) {
            return $http.post(URL_FKSOLUTIONS + 'classificacaoResposta/salvar', cadastrarClassificacaoResposta);
        }

        function editarClassificacaoResposta(classificacaoResposta) {
            return $http.post(URL_FKSOLUTIONS + 'classificacaoResposta/editar', classificacaoResposta);
        }

        function deletarClassificacaoResposta(id) {
            return $http.delete(URL_FKSOLUTIONS + 'classificacaoResposta/deletarClassificacaoResposta/' + id);
        }

        function consultaClassificacaoResposta(consultar) {
            return $http.get(URL_FKSOLUTIONS + 'classificacaoResposta/consultaClassificacaoResposta', {
                params: {
                    consultar : consultar
                }
            });
        }

        function buscarClassificacao(id) {
            return $http.get(URL_FKSOLUTIONS + 'classificacaoResposta/buscarClassificacao/' +  id );
        }

        function buscarTodasOrientacaoSolicitante() {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/buscarTodasOrientacaoSolicitante');
        }

        function buscarTodasTransparenciaAtiva() {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/buscarTodasTransparenciaAtiva');
        }

        function buscarTodasTransparenciaPassiva() {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/buscarTodasTransparenciaPassiva');
        }

        function buscarTodasAcessoNegado() {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/buscarTodosAcessoNegado');
        }

        function salvarRespostaClassificada(respostaClassificadaDTO) {
            return $http.post(URL_FKSOLUTIONS + '/classificacaoResposta/salvarRespostaClassificada/', respostaClassificadaDTO);
        }

        function verificaSePossuiClassificacaoResposta(id) {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/verificaSePossuiClassificacaoResposta/' + id);
        }

        function buscarClassificacaoResposta(id) {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/buscarClassificacaoResposta/' + id);
        }

        function gerarRelatorioExcel(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/classificacaoResposta/exportar', {
                params: {
                    filtro: fitro
                }
            });
        }

        function ativarDesativarClassificacaoResposta(id, status) {
            return $http.put(URL_FKSOLUTIONS + "/classificacaoResposta/ativarDesativar/" + id + "/" +  status);
        }

        return{
            salvarClassificacaoResposta  : salvarClassificacaoResposta,
            deletarClassificacaoResposta : deletarClassificacaoResposta,
            consultaClassificacaoResposta : consultaClassificacaoResposta,
            editarClassificacaoResposta : editarClassificacaoResposta,
            buscarClassificacao: buscarClassificacao,
            buscarTodasOrientacaoSolicitante: buscarTodasOrientacaoSolicitante,
            buscarTodasTransparenciaAtiva: buscarTodasTransparenciaAtiva,
            buscarTodasAcessoNegado: buscarTodasAcessoNegado,
            buscarTodasTransparenciaPassiva: buscarTodasTransparenciaPassiva,
            salvarRespostaClassificada: salvarRespostaClassificada,
            verificaSePossuiClassificacaoResposta: verificaSePossuiClassificacaoResposta,
            buscarClassificacaoResposta: buscarClassificacaoResposta,
            gerarRelatorioExcel: gerarRelatorioExcel,
            ativarDesativarClassificacaoResposta: ativarDesativarClassificacaoResposta
        };
    }


})();
