(function () {

    'use strict';

    angular
        .module('sdsicApp')
        .factory('ArquivoService', ['MensagensService','$http', 'Upload', service ]);
    function service(MensagensService, $http, Upload) {

        var CONTENT_TYPE_PDF = 'application/pdf';
        var CONTENT_TYPE_DOC = 'application/doc';
        var CONTENT_TYPE_DOCX = 'application/docx';
        var CONTENT_TYPE_PPT = 'application/ppt';
        var CONTENT_TYPE_PPTX = 'application/pptx';
        var CONTENT_TYPE_RTF = 'application/rtf';
        var CONTENT_TYPE_ODT = 'application/odt';
        var CONTENT_TYPE_ODP = 'application/odp';
        var CONTENT_TYPE_ODS = 'application/ods';
        var CONTENT_TYPE_XLSX = 'application/xls';
        var CONTENT_TYPE_XLM = 'application/xlm';
        var CONTENT_TYPE_XLS = 'application/xls';
        var CONTENT_TYPE_XLS = 'application/xls';
        var CONTENT_TYPE_CSV = 'application/csv ';
        var CONTENT_TYPE_ZIP = 'application/zip ';
        var CONTENT_TYPE_SXW = 'application/sxw';
        var CONTENT_TYPE_TXT = 'application/txt';
        var CONTENT_TYPE_JPG = 'image/jpg';
        var CONTENT_TYPE_BITMAP = 'image/BITMAP';
        var CONTENT_TYPE_JPEG = 'image/jpeg';
        var CONTENT_TYPE_PNG = 'image/png';
        var CONTENT_TYPE_TIF = 'image/tif';
        var CONTENT_TYPE_GIF = 'image/gif';


        var CONTENT_TYPE_IMAGE = ['image/png', 'image/jpeg', 'image/jpg', 'image/tif'];

        var TAMANHO_MAXIMO_ARQUIVO = 30000;

        var URL = '/sdsic/api/public/arquivo/upload';

        var URL_FILE = '/sdsic/api/public/arquivo/upload/file';

        var URL_DOWNLOAD = '/sdsic/api/public/arquivo/download/';

        var validarTamanhoMaximoArquivo = function (tamanho) {
            if (tamanho > TAMANHO_MAXIMO_ARQUIVO) {
                var mensagem = MensagensService.getMensagemFilter('mensagem-tamanho-max-arquivo');
                ('mensagem-tamanho-max-arquivo');
                MensagensService.exibirInfo(mensagem);
                throw mensagem;
            }
        };

        var validarFormatoArquivo = function (formato) {
            if (verificaFormatoValido(formato)) {
                var mensagem = MensagensService.exibirMensagemErro('Arquivo em formato inválido.');
                throw mensagem;
            }
        };

        var verificaFormatoValido = function (formato) {
            var formatoInvalido = true;
            if (formato == CONTENT_TYPE_PDF) {
                formatoInvalido = false;
            }
            return formatoInvalido;
        };

        var validarExtensaoImagem = function ($file) {
            return CONTENT_TYPE_IMAGE.indexOf($file.type) == -1;
        };

        var addArquivo = function ($file, sdsic) {

            if (!sdsic.arquivo) {
                sdsic.arquivo = {};
            }

            if ($file) {
                validarFormatoArquivo($file.type);
                validarTamanhoMaximoArquivo($file.size);

                Upload.upload({url: URL, data: {file: $file}}).then(function (response) {
                    $file.id = response.data.resposta[0];
                    sdsic.arquivo = $file;
                });
            }

        };



        var addArquivoSemValidar = function ($file, arquivos) {
            if ($file) {
                if (!arquivos) {
                    arquivos = [];
                }

                for(var i=0; i<$file.length; i++){
                    Upload.upload({url: URL_FILE, data: {file: $file[i]}}).then(function (response) {
                        arquivos.push( response.data.resposta[0]);
                    });
                }
            }

        };

        var adicionar = function ($file, arquivos) {
            if (!arquivos) {
                arquivos = [];
            }

            if ($file) {
                validarFormatoArquivo($file.type);
                validarTamanhoMaximoArquivo($file.size);
                Upload.upload({url: URL, data: {file: $file}}).then(function (response) {
                    $file.id = response.data.resposta[0];
                    arquivos.push($file);
                });
            }
        };


        var limparArquivosCarregados = function (arquivos) {

            angular.forEach(arquivos, function (item) {
                item.files = [];
            });

        };

        var prepararDadosArquivoRequerimento = function (documentos) {
            var arquivosRequerimento = [];
            angular.forEach(documentos, function (documento) {
                if (documento.files) {
                    angular.forEach(documento.files, function (file) {
                        arquivosRequerimento.push({idDocumento: documento.id, idArquivo: file.id});
                    });
                }
            });
            return arquivosRequerimento;
        };


        var apagar = function (id) {
            return $http.delete('sdsic/api/public/arquivo/' + id);
        };

        var apagarServico = function (id) {
            return $http.delete('api/public/servico/arquivo/' + id);
        };

        var uploadArquivo = function($file){
            return Upload.upload({
                url: URL,
                data: {
                    file: $file
                }
            });
        };

        var uploadRetornarArquivo = function($file){
            return Upload.upload({
                url: URL + '/file',
                data: {
                    file: $file
                }
            });
        };

        var download = function (id) {
            return URL_DOWNLOAD + id;
        };

        var uploadCallback = function ($file, callback) {
            if ($file) {
                Upload.upload({url: URL_UPLOAD_FILE, data: {file: $file}}).then(function (response) {
                    callback(response.data.resposta[0]);
                });
            }
        };

        return {
            validarTamanhoMaximoArquivo: validarTamanhoMaximoArquivo,
            validarFormatoArquivo: validarFormatoArquivo,
            addArquivo: addArquivo,
            addArquivoSemValidar: addArquivoSemValidar,
            limparArquivosCarregados: limparArquivosCarregados,
            prepararDadosArquivoRequerimento: prepararDadosArquivoRequerimento,
            apagar: apagar,
            apagarServico: apagarServico,
            adicionar: adicionar,
            uploadArquivo: uploadArquivo,
            uploadRetornarArquivo: uploadRetornarArquivo,
            validarExtensaoImagem: validarExtensaoImagem,
            download: download,
            uploadCallback:uploadCallback
        };














    }

})();
