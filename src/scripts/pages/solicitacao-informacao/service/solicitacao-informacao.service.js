(function () {

    'use strict';

    angular.module('sdsicApp').factory('SolicitacaoInformacaoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarPedido(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/pedido', {
                params: {
                    filtro: fitro
                }
            });
        }

        function gerarRelatorioExcel(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/exportar', {
                params: {
                    filtro: fitro
                }
            });
        }

        function consultarDetalhePedido(id) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/' + id);
        }

        function temAcesso(id) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/tem/acesso/' + id);
        }

        function downloadAnexo(protocolo, nome) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/downloadAnexo', {
                params: {
                    protocolo: protocolo,
                    nome: nome
                }
            });
        }

        function associarPedidoTema(pedidoTemaDTO) {
            return $http.post(URL_FKSOLUTIONS + '/pedido/associarPedidoTema/', pedidoTemaDTO );
        }

        function consultarStatusRespostaAssinada(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/consultarStatusRespostaAssinada/' + idPedido);
        }

        function verificaTema(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/verificaTema/' + idPedido);
        }

        function consultarStatusSolicitacao(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/consultarStatusSolicitacao/' + idPedido);
        }

        function buscarTodosTemasSubtemasPalavraChavePedido(idPedido) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/buscarTodosTemasSubtemasPalavraChavePedido/' + idPedido);

        }

        function enviar(uploadingFiles,pedido, tipo, isntancia) {
            var formData = new FormData ();

            for(var i=0 ; i < uploadingFiles.length ; i++){
                formData.append('file',uploadingFiles[i]);
            }

            return $http.post(URL_FKSOLUTIONS + '/fileUpload/filesUpload/' + pedido + '/' + tipo + '/' + isntancia, formData, {
                transformResponse : angular.identity,
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).error(function (){
                console.log('Error');
            });
        }

        function download(caminho) {
            return $http.get(URL_FKSOLUTIONS + '/fileUpload/download', { params: { caminho: caminho }, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'blob' });
        }

        function listaArquivos(idPedido, tipo, instancia) {
            return $http.get(URL_FKSOLUTIONS + '/fileUpload/listaArquivos/' + idPedido + '/' + tipo + '/' + instancia);
        }

        function deleteFile(caminho) {
            return $http.delete(URL_FKSOLUTIONS + '/fileUpload/delete', { params: { caminho: caminho } });
        }

        function alterarVencimentoEouv(consultaPedidoDTO) {
            return $http.post(URL_FKSOLUTIONS + '/pedido/alterarPedidoEouv', consultaPedidoDTO );
        }

        function validarEouv(idPedido) {
            return $http.post(URL_FKSOLUTIONS + '/eouv/validarEouv/' + idPedido);

        }

        return {
            consultarPedido: consultarPedido,
            gerarRelatorioExcel: gerarRelatorioExcel,
            consultarPedidoDetalhado: consultarDetalhePedido,
            downloadAnexo: downloadAnexo,
            associarPedidoTema: associarPedidoTema,
            consultarStatusRespostaAssinada: consultarStatusRespostaAssinada,
            verificaTema: verificaTema,
            consultarStatusSolicitacao: consultarStatusSolicitacao,
            enviar: enviar,
            listaArquivos: listaArquivos,
            deleteFile: deleteFile,
            buscarTodosTemasSubtemasPalavraChavePedido: buscarTodosTemasSubtemasPalavraChavePedido,
            alterarVencimentoEouv: alterarVencimentoEouv,
            validarEouv: validarEouv,
            download: download,
            temAcesso: temAcesso
        };

    }

})();
