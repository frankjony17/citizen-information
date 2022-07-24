(function () {

    'use strict';

    angular.module('sdsicApp').controller('DetalheSolicitacaoInformacaoController', ['$scope', '$mdDialog', '$stateParams', '$window', '$document', '$log', '$state', '$mdToast', 'SolicitacaoInformacaoService', 'EnviarPedidoRevisaoService', 'MensagensService', 'FinalizarEouvService', 'AndamentoPedidoService', 'HistoricoPedidoService', 'RespostaPedidoService', 'EntregarRespostaService', 'HistoricoRecursoService', 'AndamentoRecursoService', 'RecursoService', 'GlossarioDeAssuntoService', 'RespostaAssinadaRecursoService', 'EscopoCompartilhadoPedidoDuplicadoService', 'ArquivoService', 'permissoesService', controller]);
    function controller($scope, $mdDialog, $stateParams, $window, $document, $log, $state, $mdToast, SolicitacaoInformacaoService, EnviarPedidoRevisaoService, MensagensService, FinalizarEouvService, AndamentoPedidoService, HistoricoPedidoService, RespostaPedidoService, EntregarRespostaService, HistoricoRecursoService, AndamentoRecursoService, RecursoService, GlossarioDeAssuntoService, RespostaAssinadaRecursoService, EscopoCompartilhadoPedidoDuplicadoService, ArquivoService, permissoesService) {

        var scope = this;

        scope.abas = {
            selectedIndex: 0
        };

        // Declaração de variaveis -------------------------------------------------------------------------------------
        scope.pedidoDetalhadoDTO = {};
        scope.ancora = {};
        scope.listaAndamentoPedidoDTO = {};
        scope.listaHistoricoPedidoDTO = {};
        scope.recursoDetalhadoDTO = {};
        scope.haveTema = undefined;
        scope.recursoDetalhadoSegundaInstanciaDTO = {};
        scope.responsavelResposta = undefined;
        scope.destinatarioRecursoPrimeiraInstancia = undefined;
        scope.idPedido = $stateParams.idPedido;
        scope.verificaDataProrrogar;
        scope.verificaDataEouv;
        scope.verificaDataProrrogarESic;
        scope.fluxo = 'responder';
        $scope.historicoTratamento = {};
        scope.tabelaConsultaHistorico = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };
        scope.tabelaConsultaHistoricoPrimeiraInstancia = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };
        scope.tabelaConsultaHistoricoSegundaInstancia = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };
        scope.tabelaConsultaAndamento = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };
        scope.arquivo = undefined;
        scope.arquivos = [];
        scope.TemasSubtemasPalavraChavePedido = {};
        scope.listFiles =  {};
        scope.totalMbFile = 0;
        // Declaração de metodos publicos-------------------------------------------------------------------------------

        scope.downloadAnexo = _downloadAnexo;
        scope.consultarDadosSolicitante = _consultarDadosSolicitante;
        scope.responder = _responder;
        scope.encaminharPropostaResposta = _encaminharPropostaResposta;
        scope.confirmarAssinatura = _confirmarAssinatura;
        scope.encaminhar = _encaminhar;
        scope.encaminharEouv = _encaminharEouv;
        scope.reencaminharParaOrgao = _reencaminharParaOrgao;
        scope.prorrogarPrazo = _prorrogarPrazo;
        scope.prorrogarPrazoEsic = _prorrogarPrazoEsic;
        scope.devolverPedido = _devolverPedido;
        scope.voltar = _voltar;
        scope.voltarPedido = _voltarPedido;
        scope.enviarPedidoRevisao = _enviarPedidoRevisao;
        scope.finalizarEouv = _finalizarEouv;
        scope.carregarAndamentoPedido = _carregarAndamentoPedido;
        scope.carregarHistoricoPedido = _carregarHistoricoPedido;
        scope.voltarAbaSolicitacao = _voltarAbaSolicitacao;
        scope.cancelarRespostaPedido = _cancelarRespostaPedido;
        scope.editarResposta = _editarResposta;
        scope.classificarResposta = _classificarResposta;
        scope.classificarRespostaSic = classificarRespostaSic;
        scope.entregarResposta = _entregarResposta;
        scope.enviarResposta = _enviarResposta;
        scope.devolver = _devolver;
        scope.encaminharRecurso = _encaminharRecurso;
        scope.responderRecurso = _responderRecurso;
        scope.verificaNumeroDaAba = verificaNumeroDaAba;
        scope.consultarDadosRecurso = _consultarDadosRecurso;
        scope.carregarHistoricoRecurso = _carregarHistoricoRecurso;
        scope.carregarHistoricoRecursoSegundaInstancia = _carregarHistoricoRecursoSegundaInstancia;
        scope.consultarPedidosDuplicados = _consultarPedidosDuplicados;
        scope.confirmarDelete = confirmarDelete;
        scope.validarEouv = _validarEouv;

        scope.temPermissao = function (element) {
            return permissoesService.temPermissao(element, scope.pedidoDetalhadoDTO);
        };
        // Inicialização da controller----------------------------------------------------------------------------------
        init();

        // Implementação de metodos privados----------------------------------------------------------------------------
        function init() {
            moveTop();
            carregarPedidoDetalhado();
            verificarBotaoProrrogarESic();
            _carregarAndamentoPedido();
            _carregarHistoricoPedido();
            carregarAndamentoRecurso();
            listaArquivos();
        }

        function moveTop() {
            document.getElementById('titulo').scrollIntoView();
        }

        function verificaNumeroDaAba(numeroDaAba) {
            switch (numeroDaAba) {
                case 0:
                    scope.pedidoDetalhadoDTO = scope.ancora;
                    break;
                case 1:
                    scope.pedidoDetalhadoDTO = scope.recursoDetalhadoDTO;
                    break;
                case 2:
                    scope.pedidoDetalhadoDTO = scope.recursoDetalhadoSegundaInstanciaDTO;
                    break;
                case 3:
                    if (scope.recursoDetalhadoSegundaInstanciaDTO.idRecurso) {
                        verificaNumeroDaAba(2);
                    } else {
                        if (scope.recursoDetalhadoDTO.idRecurso) {
                            verificaNumeroDaAba(1);
                        }
                        else {
                            verificaNumeroDaAba(0);
                        }
                    }
                    break;
            }
            listaArquivos();
        }

        function verificaPedidoDevolvido(pedidoDetalhadoDTO) {
            if (pedidoDetalhadoDTO.isDevolver) {
                pedidoDetalhadoDTO.possuiTratamentoFinal = false;
            }
        }

        scope.liberaCampos = function () {
            scope.flag = true;
        };

        scope.addDocumentos = function ($files, sdsic, validarExtensao) {
            if (angular.isDefined($files)) {
                ArquivoService.addArquivo($files[0], sdsic, validarExtensao);
            }
        };
        function extensoesPermitidas(){
            var ext = [];
            ext.push("bmp");
            ext.push("csv");
            ext.push("doc");
            ext.push("docx");
            ext.push("gif");
            ext.push("jpg");
            ext.push("pdf");
            ext.push("png");
            ext.push("ppt");
            ext.push("pptx");
            ext.push("rtf");
            ext.push("odt");
            ext.push("ods");
            ext.push("odp");
            ext.push("sxw");
            ext.push("tif");
            ext.push("txt");
            ext.push("xlm");
            ext.push("xls");
            ext.push("xlsx");
            ext.push("zip");
            return ext;
        }

        scope.adicionarArquivo = function () {

            // FIX ME: João quando vc terminar o RECURSO ajusta essa validação para funcionar para o PEDIDO E O RECURSO
            var a;
            if(scope.pedidoDetalhadoDTO.idPedido != undefined) {
                a = document.getElementById("file");
            }else if(scope.abas.selectedIndex == 1){
                a = document.getElementById("fileRecurso1");
            }else if(scope.abas.selectedIndex == 2){
                a = document.getElementById("fileRecurso2");
            }
                var isExisteAquivo;
                var balde;
                for (var i = 0; i < a.files.length; i++) {
                    isExisteAquivo = false;
                    balde = a.files[i];
                    var extensao = a.files[i].name.split(".");
                    if(scope.arquivos.length >= 10){
                        MensagensService.exibirMensagemErro("Não é possivel enviar mais de 10 arquivos !");
                        return;
                    }
                    if(scope.totalMbFile + (a.files[i].size)/1024/1024 > 30 ){
                        MensagensService.exibirMensagemErro("Tamanho máximo de 30Mb excedido !");
                        return;
                    }
                    var extensoes = extensoesPermitidas();
                    if(!extensoes.includes(extensao[extensao.length - 1].toLowerCase())){
                        MensagensService.exibirMensagemErro("Extensão de arquivo não permitida");
                        return;
                    }

                    for (var j = 0; j < scope.arquivos.length; j++) {
                        if (scope.arquivos[j].name === balde.name)
                            MensagensService.exibirMensagemErro(a.files[i].name+" Já existe no servidor de arquivos");
                        {
                            isExisteAquivo = true;
                            break;
                        }
                        return;
                    }

                    if (isExisteAquivo) {
                        MensagensService.exibirMensagemErro(a.files[i].name+" Já existe no servidor de arquivos");
                    } else {
                        scope.arquivos.push(balde);
                        enviarArquivos();
                        calcularMB();
                    }
                }

        };

        function calcularMB() {
            scope.totalMbFile = 0;
            for(var i= 0; i < scope.arquivos.length; i++){
                scope.totalMbFile += (scope.arquivos[i].size)/1024/1024;
            }

        }

        function listaArquivos() {

            var tipo = undefined;
            var instancia = undefined;

            if (scope.pedidoDetalhadoDTO.idPedido != undefined || scope.abas.selectedIndex === 0) {
                tipo = 'PEDIDO';
            } else {
                tipo = 'RECURSO';
                instancia = scope.abas.selectedIndex;
            }

            SolicitacaoInformacaoService.listaArquivos(scope.idPedido, tipo, instancia)
                .then(function (response) {

                    scope.arquivos = [];

                    scope.listFiles = response.data;

                    for (var i = 0; i < scope.listFiles.length; i++) {

                        var file = scope.listFiles[i];

                        var arquivo = {
                            nome: file.nome,
                            caminho: file.caminho,
                            size: file.tamanho
                        };
                        scope.arquivos.push(arquivo);
                    }

                    calcularMB();
                });
        }

        scope.downloadFile = function (arquivo) {
            SolicitacaoInformacaoService.download(arquivo.caminho).then(function (response) {
                if (response.data) {
                    var blob = new Blob([response.data]);

                    var url = window.URL.createObjectURL(blob);
                    var element = window.document.createElement('a');
                    document.body.appendChild(element);

                    element.href = url;
                    element.download = arquivo.nome;
                    element.click();
                    document.body.removeChild(element);
                }
            }, function (error) {
                MensagensService.exibirMensagemErro('Erro ao realizar download');
            });
        };

        function excluirArquivo(posicao, arquivo) {
            if (arquivo && arquivo.caminho) {
                SolicitacaoInformacaoService.deleteFile(arquivo.caminho)
                    .then(function () {
                        scope.arquivos.splice(posicao, 1);
                        calcularMB();
                    });
            }
        }

         function enviarArquivos () {

             var tipo = null;
             var instancia = null;

             if (scope.pedidoDetalhadoDTO.idPedido != undefined) {
                 tipo = 'PEDIDO';
             } else {
                 tipo = 'RECURSO';
                 instancia = scope.abas.selectedIndex;
             }

             if(scope.arquivos != null){
                 SolicitacaoInformacaoService.enviar(scope.arquivos, scope.idPedido, tipo, instancia).then(
                     function () {
                         listaArquivos();
                         MensagensService.exibirMensagemSucesso("Arquivos enviados com sucesso.");
                     },
                     function (errorResponse) {
                         var a = JSON.parse(errorResponse.data);
                         var b = JSON.stringify(a.message).split(":");
                         MensagensService.exibirMensagemErro(b[0]);
                     }
                 )
             }
        }

        function carregarPedidoDetalhado() {
            SolicitacaoInformacaoService.consultarPedidoDetalhado(scope.idPedido).then(function (successResponse) {
                scope.pedidoDetalhadoDTO = successResponse.data;
                scope.ancora = successResponse.data;
                verificaDataProrrogar();
                verificaDataEouv();
                verificaDataProrrogarESic();
                verificaPedidoDevolvido(scope.pedidoDetalhadoDTO);
                verificaPermissaoDoUsuario();
                carregarRecursoDetalhadoPrimeiraInstancia(scope.pedidoDetalhadoDTO.idPedido);
                carregarRecursoDetalhadoSegundaInstancia(scope.pedidoDetalhadoDTO.idPedido);
                if (scope.pedidoDetalhadoDTO.possuiEOuv) {
                    scope.pedidoDetalhadoDTO.possuiRespostaPerfil = false;
                }
                console.log(scope.pedidoDetalhadoDTO);
            });
        }

        function confirmarDelete (ev,posicao, arquivo) {
            if(((((scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC") || (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão"))  && scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.ATENDENTE.SIC") ||
                (((scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Distribuição PF") || (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta Assinada"))  && scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.PONTO.FOCAL") ||
                (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Produção de Resposta" ) && (scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.AUTORIDADE.HIERARQUICA" || scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.RESPONDENTE") ||
                ((scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Edição Técnico") && (scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.TECNICO")))

                ||scope.pedidoDetalhadoDTO.idPedido == undefined){
                $mdDialog.show({
                    templateUrl: 'scripts/pages/solicitacao-informacao/view/confirmacao-exclusao-file-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: scope.customFullscreen, // Only for -xs, -sm breakpoints.
                    locals: {},
                    controller: ['$scope', function ($scope) {
                        $scope.voltar = function () {
                            excluirArquivo(posicao, arquivo);
                            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                            $mdDialog.cancel();
                        };

                        $scope.cancelar = function () {
                            $mdDialog.cancel();
                        }

                    }]
                }).then(function () {
                    MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                });
            }
            else{
                MensagensService.exibirMensagemErro("Você não tem autorização para excluir este anexo");
            }
        }

        function _downloadAnexo(nome) {
            SolicitacaoInformacaoService.downloadAnexo(scope.pedidoDetalhadoDTO.protocolo, nome).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = arquivoBase64;
                        link.download = nome;
                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);
                        //simulate click
                        link.click();
                        //remove the link when done
                        document.body.removeChild(link);
                    } else {
                        window.open(arquivoBase64);
                    }
                },
                function (errorResponse) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao fazer o download do arquivo.")
                            .hideDelay(3000)
                    );
                    $log.log(errorResponse);
                }
            );
        }

        scope.addDocumentos = function ($files, validarExtencao) {
            if (angular.isDefined($files)) {
                ArquivoService.addArquivo($files[0], validarExtencao);
            }
        };

        function _carregarAndamentoPedido() {
            scope.offset = angular.copy(scope.tabelaConsultaAndamento.page - 1);
            scope.limit = angular.copy(scope.tabelaConsultaAndamento.limit);
            AndamentoPedidoService.consultarAndamentoPedido(scope.idPedido, scope.offset, scope.limit).then(
                function (successResponse) {
                    scope.listaAndamentoPedidoDTO = successResponse.data;
                    scope.totalElementosConsultaAndamento = successResponse.data.totalElements;
                    scope.totalPaginasConsultaAndamento = successResponse.data.totalPages;
                }
            );
        }

        function _carregarHistoricoPedido() {
            scope.offset = angular.copy(scope.tabelaConsultaHistorico.page - 1);
            scope.limit = angular.copy(scope.tabelaConsultaHistorico.limit);
            HistoricoPedidoService.consultarHistoricoPedido(scope.idPedido, scope.offset, scope.limit).then(function (successResponse) {
                scope.listaHistoricoPedidoDTO = successResponse.data;
                scope.totalElementosConsultaHistorico = successResponse.data.totalElements;
                scope.totalPaginasConsultaHistorico = successResponse.data.totalPages;
            });
        }

        function verificaDataProrrogar() {
            var dataLimiteProrrogacao = new Date(scope.pedidoDetalhadoDTO.dataLimiteBotaoProrrogacao);
            var now = new Date();
            scope.verificaDataProrrogar = now <= dataLimiteProrrogacao;
        }

        function verificaDataProrrogarESic() {
            var dataLimiteProrrogacaoESic = new Date(scope.pedidoDetalhadoDTO.vencimentoESic);
            var now = new Date();
            scope.verificaDataProrrogarESic = now <= dataLimiteProrrogacaoESic;
        }

        function verificaDataEouv() {
            var dataLimiteEouv = new Date(scope.pedidoDetalhadoDTO.dataLimiteBotaoEouv);
            var now = new Date();
            scope.verificaDataEouv = now <= dataLimiteEouv;
        }

        function carregarRecursoDetalhadoPrimeiraInstancia(idRecurso) {
            var instancia = "primeiraInstancia";
            RecursoService.consultarDetalheRecurso(idRecurso, instancia).then(
                function (successResponse) {
                    scope.recursoDetalhadoDTO = successResponse.data;
                    if (scope.recursoDetalhadoDTO.idRecurso != undefined) {
                        scope.abas.selectedIndex = 1;
                        verificaNumeroDaAba(scope.abas.selectedIndex);
                    }
                    _carregarHistoricoRecurso();
                    consultarDataRespostaRecurso(scope.recursoDetalhadoDTO.idRecurso);
                }
            );
        }

        function carregarRecursoDetalhadoSegundaInstancia(idRecurso) {
            var instancia = "segundaInstancia";
            RecursoService.consultarDetalheRecurso(idRecurso, instancia).then(
                function (successResponse) {
                    scope.recursoDetalhadoSegundaInstanciaDTO = successResponse.data;
                    if (scope.recursoDetalhadoSegundaInstanciaDTO.idRecurso != undefined) {
                        scope.abas.selectedIndex = 2;
                        verificaNumeroDaAba(scope.abas.selectedIndex);

                    }
                    _carregarHistoricoRecursoSegundaInstancia();
                    consultarDataRespostaRecurso(scope.recursoDetalhadoSegundaInstanciaDTO.idRecurso);
                }
            );
        }

        function carregarAndamentoRecurso() {
            scope.offset = angular.copy(scope.tabelaConsultaAndamento.page - 1);
            scope.limit = angular.copy(scope.tabelaConsultaAndamento.limit);
            AndamentoRecursoService.consultarAndamentoRecurso(scope.idPedido, scope.offset, scope.limit).then(
                function (successResponse) {
                    scope.listaAndamentoRecursoDTO = successResponse.data;
                    scope.totalElementosConsultaAndamento = successResponse.data.totalElements;
                    scope.totalPaginasConsultaAndamento = successResponse.data.totalPages;
                }
            );
        }

        function _carregarHistoricoRecursoSegundaInstancia() {
            scope.offset = angular.copy(scope.tabelaConsultaHistoricoSegundaInstancia.page - 1);
            scope.limit = angular.copy(scope.tabelaConsultaHistoricoSegundaInstancia.limit);
            HistoricoRecursoService.consultarHistoricoRecurso(scope.recursoDetalhadoSegundaInstanciaDTO.idRecurso, scope.offset, scope.limit).then(
                function (successResponse) {
                    scope.listaHistoricoRecursoSegundaInstanciaDTO = successResponse.data;
                    scope.totalElementosConsultaHistoricoSegundaInstancia = successResponse.data.totalElements;
                    scope.totalPaginasConsultaHistoricoSegundaInstancia = successResponse.data.totalPages;
                }
            );
        }

        function _carregarHistoricoRecurso() {
            scope.offset = angular.copy(scope.tabelaConsultaHistoricoPrimeiraInstancia.page - 1);
            scope.limit = angular.copy(scope.tabelaConsultaHistoricoPrimeiraInstancia.limit);
            HistoricoRecursoService.consultarHistoricoRecurso(scope.recursoDetalhadoDTO.idRecurso, scope.offset, scope.limit).then(
                function (successResponse) {
                    scope.listaHistoricoRecursoDTO = successResponse.data;
                    scope.totalElementosConsultaHistoricoPrimeiraInstancia = successResponse.data.totalElements;
                    scope.totalPaginasConsultaHistoricoPrimeiraInstancia = successResponse.data.totalPages;
                }
            );
        }

        function consultarDataRespostaRecurso(idRecurso) {
            HistoricoRecursoService.consultarDataRespostaRecurso(idRecurso).then(function (successResponse) {
                scope.dataRespostaRecurso = successResponse.data;
            });
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------
        function _consultarDadosSolicitante(nome) {
            if (scope.pedidoDetalhadoDTO.solicitanteDTO.tipoPessoa != 'I' && scope.pedidoDetalhadoDTO.solicitanteDTO.tipoPessoa != null) {
                $state.go("dadosSolicitante", {consulta: nome, id: scope.idPedido, instancia: "SolicitacaoInformacao"});
            }
            else {
                MensagensService.exibirMensagemErro("O requerente deste pedido optou por preservar sua identidade, conforme o §7º art 10 da lei 13.460/2017");
            }
        }

        function _consultarDadosRecurso(nomeInstancia) {
                if (scope.recursoDetalhadoDTO.solicitanteDTO.tipoNome != 'I' && scope.pedidoDetalhadoDTO.solicitanteDTO.tipoPessoa != null) {
                    $state.go("dadosSolicitante", {consulta: "recurso", id: scope.idPedido, instancia: nomeInstancia});
                }
                else {
                    MensagensService.exibirMensagemErro("O requerente deste pedido optou por preservar sua identidade, conforme o §7º art 10 da lei 13.460/2017");
                }
            }

        function _responder() {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(function (sucessResponse) {
                    scope.haveTema = sucessResponse.data;
                    if (scope.haveTema) {
                        $state.go("responderPedidoInformacao", {fluxo: "pedido", idPedido: scope.idPedido});
                    } else {
                        MensagensService.exibirMensagemErro("Para responder,é necessário vincular o pedido a um assunto!");
                    }
                });
            } else {
                $state.go("responderPedidoInformacao", {fluxo: "pedido", idPedido: scope.idPedido});
            }

        }

        function _responderRecurso(idRecurso) {
            $state.go("respostaAssinadaRecurso", {id: idRecurso});
        }

        function _editarResposta() {
            $state.go("editarResposta", {idPedido: scope.idPedido});
        }

        function _enviarPedidoRevisao() {
            if (scope.pedidoDetalhadoDTO.isClassificacaoResposta == true && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC") {
                EnviarPedidoRevisaoService.enviarPedidoRevisao(scope.idPedido).then(function () {
                        MensagensService.exibirMensagemSucesso("O pedido de informação foi enviado para revisão.");
                        $state.reload();
                    }, function (responseError) {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Ocorreu um erro não esperado ao enviar para revisão.")
                                .hideDelay(3000)
                        );
                    });
            } else {
                MensagensService.exibirMensagemErro("Para enviar para revisão, é necessário classificar resposta!");
            }
        }

        function _finalizarEouv() {
            FinalizarEouvService.finalizarEouv(scope.idPedido).then(function () {
                MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                $state.reload();
            }, function () {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Ocorreu um erro não esperado ao finalizar e-OUV.")
                        .hideDelay(3000)
                );
            });
        }

        function _validarEouv(ev) {
            if(scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == 'Produção de Resposta' && scope.pedidoDetalhadoDTO.perfilUsuario == 'FKSOLUTIONS.RESPONDENTE'){
                $mdDialog.show({
                    templateUrl: 'scripts/pages/e-ouv/view/eouv-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: scope.customFullscreen, // Only for -xs, -sm breakpoints.
                    locals: {
                        idPedido: scope.idPedido
                    },
                    controller:['$scope', 'idPedido',function ($scope, idPedido) {
                        $scope.idPedido = idPedido;
                        $scope.salvarStatus = function () {
                            SolicitacaoInformacaoService.validarEouv(scope.idPedido).then(
                                function (response) {
                                    $mdDialog.hide(response.data.resultado);
                                    MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                                    $state.reload();
                                },
                                function (responseError) {
                                    $mdToast.show(
                                        $mdToast.simple()
                                            .textContent("Ocorreu um erro não esperado ao finalizar e-OUV.")
                                            .hideDelay(3000)
                                    );
                                    console.log(responseError);
                                }

                            );
                        };
                        $scope.cancelar = function () {
                            $mdDialog.cancel();
                        }

                    }]

                });
            } else {
                SolicitacaoInformacaoService.validarEouv(scope.idPedido).then(function () {
                    MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                    $state.reload();
                }, function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao finalizar e-OUV.")
                            .hideDelay(3000)
                    );
                });
            }
        }

        function _entregarResposta() {
            EntregarRespostaService.entregarResposta(scope.idPedido).then(
                function () {
                    MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                    $state.reload();
                },
                function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao Entregar Resposta.")
                            .hideDelay(3000)
                    );
                }
            )
        }

        function _voltarAbaSolicitacao() {
            scope.abas.selectedIndex = 0;

        }

        function verificarBotaoProrrogarESic() {
            var dataAtual = new Date();
            if (dataAtual > scope.pedidoDetalhadoDTO.dataRespostaEsic) {
                return dataAtual;
            }
        }

        function _cancelarRespostaPedido() {
            RespostaPedidoService.cancelarResposta(scope.idPedido).then(
                function () {
                    MensagensService.exibirMensagemSucesso("Resposta cancelada com sucesso.");
                    $state.reload();
                },
                function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao cancelar a resposta.")
                            .hideDelay(3000)
                    );
                }
            )
        }

        function verificaPermissaoDoUsuario() {
            if (scope.pedidoDetalhadoDTO.perfilUsuario == "FKSOLUTIONS.ATENDIMENTO.SIC" && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao != "Triagem SIC"
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao != "Resposta SIC" && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao != "Revisão"
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao != "Para Envio") {
                scope.permissao = true;
            } else {
                scope.permissao = false;
            }
        }

        scope.visualizarHistoricoPedido = function (ev, id) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/historico-pedido-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    pedidoDetalhadoDTO: scope.pedidoDetalhadoDTO
                },
                controller: ['$scope', 'pedidoDetalhadoDTO', function ($scope, pedidoDetalhadoDTO) {
                    //$scope.resposta = pedidoDetalhadoDTO;
                    HistoricoPedidoService.buscarRepostaHistorico(id).then(
                        function (successResponse) {
                            $scope.historicoTratamento = successResponse.data;
                        }
                    );
                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]
            });
        };

        scope.visualizarHistoricoRecurso = function (ev, id) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/recurso/view/historico-recurso-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {},
                controller: ['$scope', function ($scope) {
                    HistoricoRecursoService.buscarRespostaHistorico(id).then(
                        function (successResponse) {
                            $scope.resposta = successResponse.data.resposta;
                        }
                    );
                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]
            });
        };

        // function encaminharRecurso() {
        //     $state.go("propostaRespostaRecurso", {idRecurso: scope.idRecurso});
        // }

        function _classificarResposta() {
            $state.go("ClassificarResposta", {idPedido: scope.idPedido});
        }

        function classificarRespostaSic() {
            $state.go("ClassificarRespostaSic", {idPedido: scope.idPedido});

        }

        function _encaminharPropostaResposta() {
            $state.go("propostaResposta", {idPedido: scope.idPedido});
        }

        function _confirmarAssinatura() {
            scope.responsavelResposta = 'Cargo do Usuario';
            scope.destinatarioRecursoPrimeiraInstancia = 'Nome do Destinatário';
        }

        function _encaminhar() {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC" ||
                scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == true && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(
                    function (sucessResponse) {
                        scope.haveTema = sucessResponse.data;
                        if (scope.haveTema) {
                            if (scope.pedidoDetalhadoDTO.possuiRespostaPerfil == false) {
                                $state.go("propostaResposta", {idPedido: scope.idPedido});
                            } else {
                                $state.go("respostaAssinada", {idPedido: scope.idPedido, resposta: 'encaminharSic'});
                            }
                        } else {
                            MensagensService.exibirMensagemErro("Para encaminhar, é necessário vincular o pedido a um assunto!");
                        }

                    }
                );
            } else if (scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == false && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão") {
                MensagensService.exibirMensagemErro("Para encaminhar para envio, é necessário classificar resposta!");
            } else {
                var resposta;
                if (scope.pedidoDetalhadoDTO.possuiRespostaPerfil == false) {
                    $state.go("propostaResposta", {idPedido: scope.idPedido});
                } else {
                    resposta = 'encaminharSic';
                    $state.go("respostaAssinada", {idPedido: scope.idPedido, resposta: 'encaminhar'});
                }
            }

        }

        function _encaminharRecurso(idRecurso) {
            $state.go("propostaRespostaRecurso", {idRecurso: idRecurso});
        }

        function _encaminharEouv() {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoResposta == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(
                    function (sucessResponse) {
                        scope.haveTema = sucessResponse.data;
                        if (scope.haveTema) {
                            $state.go('encaminharEouv', {idPedido: scope.idPedido});

                        } else {
                            MensagensService.exibirMensagemErro("Para encaminhar E-OUV, é necessário vincular o pedido a um assunto!");
                        }
                    }
                );
            } else if (scope.pedidoDetalhadoDTO.isClassificacaoResposta == false && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == false && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão") {
                MensagensService.exibirMensagemErro("Para encaminhar E-OUV, é necessário classificar resposta!");
            } else {
                $state.go('encaminharEouv', {idPedido: scope.idPedido});
            }
        }

        function _reencaminharParaOrgao(fluxo) {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC"
                || EscopoCompartilhadoPedidoDuplicadoService.getPagina()
                || scope.pedidoDetalhadoDTO.isClassificacaoResposta == true && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == true && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(
                    function (sucessResponse) {
                        scope.haveTema = sucessResponse.data;
                        if (scope.haveTema) {
                            $state.go('ReencaminharSolicitacao', {fluxo: fluxo, idPedido: scope.idPedido});
                        } else {
                            MensagensService.exibirMensagemErro("Para reencaminhar, é necessário vincular o pedido a um assunto!");
                        }
                    }
                );

            } else if (scope.pedidoDetalhadoDTO.isClassificacaoResposta == false && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC") {
                MensagensService.exibirMensagemErro("Para encaminhar para orgão, é necessário classificar resposta!");
            } else {
                $state.go('ReencaminharSolicitacao', {fluxo: fluxo, idPedido: scope.idPedido});
            }

        }

        function _prorrogarPrazo() {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoResposta == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão"
                || scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Sugestão de Reencaminhamento"
                ||scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Edição Técnico") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(
                    function (sucessResponse) {
                        scope.haveTema = sucessResponse.data;
                        if (scope.haveTema) {
                            $state.go("prorrogaPedidoInformacao", {idPedido: scope.idPedido});
                        } else {
                            MensagensService.exibirMensagemErro("Para prorrogar,é necessário vincular o pedido a um assunto!");
                        }
                    }
                );
            } else if (scope.pedidoDetalhadoDTO.isClassificacaoResposta == false || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == false) {
                MensagensService.exibirMensagemErro("Para prorrogar prazo, é necessário classificar resposta!");

            } else {
                $state.go("prorrogaPedidoInformacao", {idPedido: scope.idPedido});
            }
        }

        function _prorrogarPrazoEsic() {
            if (scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Triagem SIC"
                || scope.pedidoDetalhadoDTO.isClassificacaoResposta == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Resposta SIC" ||
                scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == true
                && scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Revisão"
                ||scope.pedidoDetalhadoDTO.nomeStatusSolicitacao == "Edição Técnico") {
                SolicitacaoInformacaoService.verificaTema(scope.idPedido).then(
                    function (sucessResponse) {
                        scope.haveTema = sucessResponse.data;
                        if (scope.haveTema) {
                            $state.go("prorrogaPedidoInformacaoEsic", {idPedido: scope.idPedido});
                        } else {
                            MensagensService.exibirMensagemErro("Para prorrogar, é necessário vincular o pedido a um assunto!");
                        }
                    }
                );

            } else if (scope.pedidoDetalhadoDTO.isClassificacaoResposta == false || scope.pedidoDetalhadoDTO.isClassificacaoRespostaSic == false) {
                MensagensService.exibirMensagemErro("Para prorrogar prazo SIC, é necessário classificar resposta!");

            } else {
                $state.go("prorrogaPedidoInformacaoEsic", {idPedido: scope.idPedido});
            }

        }

        function _consultarPedidosDuplicados(idPedido) {
            $state.go("pedidoDuplicado", {idPedido: idPedido});
        }

        function _devolverPedido() {
            $state.go("devolverPedidoInformacao", {idPedido: scope.idPedido});
        }

        function _voltarPedido() {
            if (EscopoCompartilhadoPedidoDuplicadoService.getPagina() == "pedidoDuplicado") {
                $state.go("pedidoDuplicado", {idPedido: EscopoCompartilhadoPedidoDuplicadoService.getIdPedidoPai()});
            } else {
                $state.go("solicitacaoInformacao");
            }
        }

        function _enviarResposta(idRecurso) {
            $state.go("enviarResposta", {id: idRecurso});
        }

        function _devolver(idRecurso) {
            $state.go("devolverRecurso", {id: idRecurso});
        }

        function _voltar() {
            $state.go("consultarRecurso");
        }
    }
})();
