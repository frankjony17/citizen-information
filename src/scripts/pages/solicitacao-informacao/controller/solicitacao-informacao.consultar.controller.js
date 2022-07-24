(function () {

    'use strict';

    angular.module('sdsicApp').controller('ConsultaSolicitacaoInformacaoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$rootScope', 'SolicitacaoInformacaoService', 'StatusTramitacaoService', 'SituacaoPedidoService', 'StatusSolicitacaoService','GlossarioDeAssuntoService', 'UsuarioService','escopoCompartilhadoService', 'EscopoCompartilhadoPedidoDuplicadoService','StatusSituacaoService','TelaAdministrativaService', 'permissoesService', 'usuarioService', controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $rootScope, SolicitacaoInformacaoService, StatusTramitacaoService, SituacaoPedidoService, StatusSolicitacaoService, GlossarioDeAssuntoService, UsuarioService,escopoCompartilhadoService, EscopoCompartilhadoPedidoDuplicadoService, StatusSituacaoService, TelaAdministrativaService, permissoesService, usuarioService) {
        var scope = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------
        scope.nomePerfil;
        scope.listaDemandasComigo = [];

        scope.filtroPedidoDTO = {
            offset: undefined,
            limit: undefined,
            idStatusTramitacao: undefined,
            protocolo: undefined,
            idUnidade: undefined,
            idSubUnidade: undefined,
            periodoInicialDataAbertura: undefined,
            periodoFinalDataAbertura: undefined,
            periodoInicialPrazoAtendimento: undefined,
            periodoFinalPrazoAtendimento: undefined,
            prazoVencidoSdsic: undefined,
            prazoProrrogadoSdsic: undefined,
            nomeSolicitante: undefined,
            tipoPessoa: undefined,
            idStatusSolicitacao: undefined,
            idOrigemSolicitacao: undefined,
            idSituacaoPedido: undefined,
            idComplementoSituacao: undefined,
            idTema: undefined,
            idSubTema: undefined,
            idAtendente: undefined,
            idClassificacaoConteudo: undefined,
            textoSolicitacao: undefined,
            textoReposta: undefined,
            periodoInicialVencimentoEsic: undefined,
            periodoFinalVencimentoEsic: undefined,
            prazoVencidoEsic: undefined,
            prazoProrrogadoEsic: undefined,
            idDemandasComigo: undefined
        };

        scope.filtroPedidoDTOConsultaRealizada = {};

        scope.listaStatusTramitacaoDTO = [];

        scope.listaOrigemSolicitacaoDTO = []; // TODO: a ser implementado

        scope.listaSituacaoPedidoDTO = [];

        scope.listaUnidadeDTO = []; // TODO: a ser implementado

        scope.listaStatusSituacaoDTO = []; // TODO: a ser implementado

        scope.listaSubUnidadeDTO = []; // TODO: a ser implementado

        scope.listaTemaDTO = []; // TODO: a ser implementado

        scope.listaSubTemaDTO = []; // TODO: a ser implementado

        scope.listaAtendenteDTO = []; // TODO: a ser implementado

        scope.listaClassificacaoConteudoDTO = []; // TODO: a ser implementado

        scope.listaStatusSolicitacaoDTO = [];

        scope.listaTodosTemas = [];

        scope.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        scope.listaConsultaPedidoDTO = [];

        scope.totalConsulta = undefined;

        scope.totalPaginasConsulta = undefined;

        scope.prazoVencidoSdsicCheckbox = undefined;

        scope.prazoVencidoEsicCheckbox = undefined;

        scope.subTemas = [];

        scope.subTema = {};

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        scope.consultar = _consultar;

        scope.limpar = _limpar;

        scope.detalhar = _detalhar;

        scope.gerarRelatorioExcel = _gerarRelatorioExcel;

        scope.defineClasseConsulta = _defineClasseConsulta;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            carregarComboStatusSituacao();
            carregarComboStatusTramitacao();
            carregarComboSituacaoPedido();
            carregarComboStatusSolicitacao();
            buscarTodosTemas();
            carregarConsulta();
            obterPerfil();
            console.log(scope.listaDemandasComigo);
            console.log(scope.nomePerfil);
        }

        function demandasComigo() {
            if (scope.nomePerfil === 'FKSOLUTIONS.ADMIN' || scope.nomePerfil === 'FKSOLUTIONS.AUTORIDADE.MAXIMA' || scope.nomePerfil === 'FKSOLUTIONS.ATENDENTE.SIC' || scope.nomePerfil === 'FKSOLUTIONS.PONTO.FOCAL.AUTORIDADE.MAXIMA') {
                scope.listaDemandasComigo = [
                    {id:1,descricao:'Todos'},
                    {id:2,descricao:'Demandas/Recursos Comigo'},
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ];
                scope.filtroPedidoDTO.idDemandasComigo = 2;
            } else if (scope.nomePerfil === 'FKSOLUTIONS.PONTO.FOCAL'
                || scope.nomePerfil === 'FKSOLUTIONS.RESPONDENTE'
                || scope.nomePerfil === 'FKSOLUTIONS.TECNICO' || scope.nomePerfil === 'FKSOLUTIONS.AUTORIDADE.HIERARQUICA') {
                scope.listaDemandasComigo = [
                    {id:2,descricao:'Demandas/Recursos Comigo'},
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ];
                scope.filtroPedidoDTO.idDemandasComigo = 2;
            } else if (scope.nomePerfil === 'FKSOLUTIONS.OBSERVADOR.SIC') {
                scope.listaDemandasComigo = [
                    {id:1,descricao:'Todos'}
                ];
                scope.filtroPedidoDTO.idDemandasComigo = 1;
            } else if (scope.nomePerfil === 'FKSOLUTIONS.OBSERVADOR.UNIDADE') {
                scope.listaDemandasComigo = [
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ];
                scope.filtroPedidoDTO.idDemandasComigo = 3;
            }
        }

        function buscarTodosTemas() {
            GlossarioDeAssuntoService.buscarTodosTemas().then(
                function (sucessResponse) {
                    scope.listaTodosTemas = sucessResponse.data.resultado;

                }
            );
        }

        scope.buscarPorSubtema = function () {
            GlossarioDeAssuntoService.buscarPorSubtema(scope.filtroPedidoDTO.idTema).then(
                function (sucessResponse) {
                    scope.subTemas = [];
                    scope.listaSubtemas = sucessResponse.data.resultado;
                    scope.idTema = scope.filtroPedidoDTO.idTema;

                }
            )
        };

        function carregarComboStatusSituacao() {
            StatusSituacaoService.listarStatusSituacao().then(
                function (successResponse) {
                    scope.listaStatusSituacaoDTO = successResponse.data;

                }
            )
        }

        function carregarComboStatusTramitacao() {
            StatusTramitacaoService.listarStatusTramitacao().then(
                function (successResponse) {
                    scope.listaStatusTramitacaoDTO = successResponse.data;
                }
            )
        }

        function carregarComboSituacaoPedido() {
            SituacaoPedidoService.listarSituacaoPedido().then(
                function (successResponse) {
                    scope.listaSituacaoPedidoDTO = successResponse.data;
                }
            )
        }

        function carregarComboStatusSolicitacao() {
            StatusSolicitacaoService.listarStatusSolicitacao().then(
                function (successResponse) {
                    scope.listaStatusSolicitacaoDTO = successResponse.data;
                }
            )
        }

        function limparTabela() {
            scope.listaConsultaPedidoDTO = [];
            scope.totalConsulta = undefined;
            scope.totalPaginasConsulta = undefined;
            scope.totalElementosConsulta = undefined;
        }
        function verificaTabelaVazia(){
           return scope.listaConsultaPedidoDTO.length == 0 &&
               scope.objeto.total == undefined &&
               scope.totalElementosConsulta == undefined &&
               scope.totalPaginasConsulta == undefined;
        }
        function  carregarConsulta() {
            scope.listaConsultaPedidoDTO = escopoCompartilhadoService.getElementos();
            scope.objeto = escopoCompartilhadoService.getLimites();
            scope.totalElementosConsulta = scope.objeto.total;
            scope.totalPaginasConsulta = scope.objeto.paginas;
            scope.filtroPedidoDTO = escopoCompartilhadoService.getFiltro();
            if(verificaTabelaVazia()){
                _consultar();
            }else{
                if(escopoCompartilhadoService.getFlag()){
                    scope.paginacao = escopoCompartilhadoService.getPaginacao();
                    scope.tabelaConsulta.limit = scope.paginacao.limit;
                    scope.tabelaConsulta.limitsPage = scope.paginacao.limitsPage;
                    scope.tabelaConsulta.page = scope.paginacao.page;
                    _consultar();
                    scope.flag = false;
                    escopoCompartilhadoService.carregarFlag(scope.flag);
                }
            }
        }
        function montarSubtemas() {
            scope.filtroPedidoDTO.idSubTema = scope.subTemas.id;
        }
        // Implementação de metodos publicos ---------------------------------------------------------------------------
        function _consultar() {
            scope.flag = true;
            montarSubtemas();
            scope.filtroPedidoDTO.offset = angular.copy(scope.tabelaConsulta.page - 1);
            scope.filtroPedidoDTO.limit = angular.copy(scope.tabelaConsulta.limit);
            SolicitacaoInformacaoService.consultarPedido(scope.filtroPedidoDTO).then(
                function (successResponse) {
                    if (successResponse.data && successResponse.data.resultado && successResponse.data.resultado.length > 0) {
                        var consulta = successResponse.data.resultado;
                        var eouvVencido  = [];
                        for(var i = 0; i < consulta.length;i++){
                            var dataAtual = new Date();
                            var dataPrazoVencido = new Date(consulta[i].prazoVencimento);
                            //implementar 5dias - 1 dia util
                            dataPrazoVencido.setDate(dataPrazoVencido.getDate() - 4);
                            if (dataAtual >= dataPrazoVencido && consulta[i].isEouv) {
                                if(consulta[i].nomeStatusSolicitacao == "Resposta Assinada"
                                    ||consulta[i].nomeStatusSolicitacao == "Produção de Resposta"
                                    ||consulta[i].nomeStatusSolicitacao == "Resposta SIC"
                                    ||consulta[i].nomeStatusSolicitacao == "Revisão"){
                                    eouvVencido.push(consulta[i]);
                                }
                            }
                        }
                        SolicitacaoInformacaoService.alterarVencimentoEouv(eouvVencido);
                        scope.listaConsultaPedidoDTO = successResponse.data.resultado;
                        scope.totalElementosConsulta = successResponse.data.totalElementos;
                        scope.totalPaginasConsulta = successResponse.data.totalPaginas;
                        scope.filtroPedidoDTOConsultaRealizada = angular.copy(scope.filtroPedidoDTO);
                        escopoCompartilhadoService.carregarElementos(scope.listaConsultaPedidoDTO);
                        escopoCompartilhadoService.carregarLimites(scope.totalPaginasConsulta,scope.totalElementosConsulta,scope.tabelaConsulta.page,scope.tabelaConsulta.limit);
                        escopoCompartilhadoService.carregarFiltroConsulta(scope.filtroPedidoDTOConsultaRealizada);
                        escopoCompartilhadoService.carregarPaginacao(scope.tabelaConsulta.limit,scope.tabelaConsulta.limitsPage,scope.tabelaConsulta.page);
                        escopoCompartilhadoService.carregarFlag(scope.flag);
                    } else {
                        limparTabela();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados não encontrados.")
                                .hideDelay(3000)
                        );
                    }
                },
                function (errorResponse) {
                    limparTabela();
                    if (errorResponse.data && errorResponse.data.erros && errorResponse.data.erros.length > 0) {
                        for (var i = 0; i < errorResponse.data.erros.length; i++) {
                            var erro = errorResponse.data.erros[i];
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(erro)
                                    .hideDelay(3000)
                            );
                        }
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Ocorreu um erro não esperado ao realizar a consulta de solicitação de informações.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }
                }

            );
        }

        function _defineClasseConsulta(consulta) {
            var dataAtual = new Date();
            var dataPrazoVencido = new Date(consulta.prazoVencimento);
            dataPrazoVencido.setDate(dataPrazoVencido.getDate() - 2);
            var dataPrazoVencidoLaranja = new Date(consulta.prazoVencimento);
            dataPrazoVencidoLaranja.setDate(dataPrazoVencidoLaranja.getDate() - 3);
            if (consulta.isEouv == true && consulta.nomeStatusSolicitacao == "Enviada") {
                return 'vermelho';
            } else if (consulta.isEouv == true) {
                return 'vermelho';
            } else if (consulta.nomeStatusTramitacao == "Enviada" && consulta.nomeStatusSolicitacao == "Enviada") {
                return 'vermelho';
            } else if (consulta.nomeStatusTramitacao == "E-Ouv" && consulta.nomeStatusSolicitacao == "Enviada" ) {
                return 'vermelho';
            } else if (dataAtual >= dataPrazoVencido) {
                return 'vermelho';
            } else if (dataAtual >= dataPrazoVencidoLaranja && dataAtual < dataPrazoVencido) {
                return 'vermelho';
            }

            return '';
        }

        function _limpar() {
            scope.filtroPedidoDTO = {
                offset: undefined,
                limit: undefined,
                idStatusTramitacao: undefined,
                protocolo: undefined,
                idUnidade: undefined,
                idSubUnidade: undefined,
                periodoInicialDataAbertura: undefined,
                periodoFinalDataAbertura: undefined,
                periodoInicialPrazoAtendimento: undefined,
                periodoFinalPrazoAtendimento: undefined,
                prazoVencido: undefined,
                prazoProrrogado: undefined,
                nomeSolicitante: undefined,
                tipoPessoa: undefined,
                idStatusSolicitacao: undefined,
                idOrigemSolicitacao: undefined,
                idSituacaoPedido: undefined,
                idComplementoSituacao: undefined,
                idTema: undefined,
                idSubTema: undefined,
                idAtendente: undefined,
                idClassificacaoConteudo: undefined,
                textoSolicitacao: undefined,
                textoReposta: undefined,
                idPalavraChave: undefined,
                idDemandasComigo: undefined
            };
            scope.prazoVencidoSdsicCheckbox = undefined;
            scope.prazoVencidoEsicCheckbox = undefined;

        }

        function _detalhar(idPedido) {
            $state.go("detalheSolicitacaoInformacao", {idPedido: idPedido});
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
        }

        function _gerarRelatorioExcel() {
            SolicitacaoInformacaoService.gerarRelatorioExcel(scope.filtroPedidoDTOConsultaRealizada).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var nomeArquivo = 'ConsultaPedidos.xls';
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = arquivoBase64;
                        link.download = nomeArquivo;
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
                            .textContent("Ocorreu um erro não esperado ao gerar o relatório excel.")
                            .hideDelay(3000)
                    );
                    $log.log(errorResponse);
                }
            );
        }

        function obterPerfil () {
            if (angular.isUndefined($rootScope.nomePerfil)) {
                usuarioService.obterPerfil().then(function(response){
                    scope.nomePerfil = response.data;
                    demandasComigo();
                });
            } else {
                scope.nomePerfil = $rootScope.nomePerfil;
                demandasComigo();
            }
        }
        // Implementação de metodos observadores------------------------------------------------------------------------

        $scope.$watch('scope.prazoVencidoSdsicCheckbox', function () {
            if (scope.prazoVencidoSdsicCheckbox) {
                scope.filtroPedidoDTO.prazoVencidoSdsic = new Date();
            } else {
                scope.filtroPedidoDTO.prazoVencidoSdsic = undefined;
            }
        });

        $scope.$watch('scope.prazoVencidoEsicCheckbox', function () {
            if (scope.prazoVencidoEsicCheckbox) {
                scope.filtroPedidoDTO.prazoVencidoEsic = new Date();
            } else {
                scope.filtroPedidoDTO.prazoVencidoEsic = undefined;
            }
        });
    }
})();
