(function () {

    'use strict';

    angular.module('sdsicApp').controller('ConsultarRecursoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$rootScope', 'SolicitacaoInformacaoService', 'StatusTramitacaoRecursoService', 'TipoRespostaRecursoService', 'StatusSolicitacaoRecursoService', 'UsuarioService', 'InstanciaRecursoService', 'SituacaoRecursoService', 'TipoRecursoService', 'RecursoService','escopoCompartilhadoService', 'EscopoCompartilhadoPedidoDuplicadoService','TelaAdministrativaService', controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $rootScope, SolicitacaoInformacaoService, StatusTramitacaoRecursoService, TipoRespostaRecursoService, StatusSolicitacaoRecursoService, UsuarioService, InstanciaRecursoService, SituacaoRecursoService, TipoRecursoService, RecursoService,escopoCompartilhadoService, EscopoCompartilhadoPedidoDuplicadoService,TelaAdministrativaService) {

        var vm = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------


        vm.filtroRecursoDTO = {
            offset: undefined,
            limit: undefined,
            idStatusTramitacao: undefined,
            idStatusSolicitacao: undefined,
            protocolo: undefined,
            idTipoResposta: undefined,
            idUnidade: undefined,
            idSubunidade: undefined,
            periodoInicialDataAbertura: undefined,
            periodoFinalDataAbertura: undefined,
            periodoInicialPrazoAtendimento: undefined,
            periodoFinalPrazoAtendimento: undefined,
            tipoPessoa: undefined,
            idInstanciaRecurso: undefined,
            periodoInicialDecisaoCgu: undefined,
            periodoFinalDecisaoCgu: undefined,
            periodoInicialDecisaoCmri: undefined,
            periodoFinalDecisaoCmri: undefined,
            periodoInicialVencimentoEsic: undefined,
            periodoFinalVencimentoEsic: undefined,
            idSituacaoRecurso: undefined,
            idTipoRecurso: undefined,
            descricaoJustificativa: undefined,
            nomeSolicitante: undefined,
            idDemandasComigo: undefined
        };

        vm.filtroPedidoDTOConsultaRealizada = {};

        vm.listaStatusTramitacaoRecursoDTO = [];

        vm.listaSituacaoPedidoDTO = [];

        vm.listaUnidadeDTO = []; // TODO: a ser implementado

        vm.listaStatusSituacaoDTO = []; // TODO: a ser implementado

        vm.listaSubUnidadeDTO = []; // TODO: a ser implementado

        vm.listaAtendenteDTO = []; // TODO: a ser implementado

        vm.listaClassificacaoConteudoDTO = []; // TODO: a ser implementado

        vm.listaStatusSolicitacaoDTO = [];

        vm.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        vm.listaConsultaPedidoDTO = [];

        vm.totalConsulta = undefined;

        vm.totalPaginasConsulta = undefined;

        vm.prazoVencidoSdsicCheckbox = undefined;

        vm.prazoVencidoEsicCheckbox = undefined;

        vm.listaDemandasComigo = [];


        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.consultar = _consultar;

        vm.limpar = _limpar;

        vm.detalhar = _detalhar;

        vm.gerarRelatorioExcel = _gerarRelatorioExcel;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            carregarComboStatusTramitacao();
            carregarComboStatusSolicitacao();
            carregarComboTipoResposta();
            carregarComboInstanciaRecurso();
            carregarComboSituacaoRecurso();
            carregarComboTipoRecurso();
            carregarConsulta();
            demandasComigo();
        }


        function demandasComigo() {
            if ($rootScope.nomePerfil === 'FKSOLUTIONS.ADMIN' || $rootScope.nomePerfil === 'FKSOLUTIONS.ATENDENTE.SIC' || $rootScope.nomePerfil === 'FKSOLUTIONS.PONTO.FOCAL.AUTORIDADE.MAXIMA') {
                vm.listaDemandasComigo = [
                    {id:1,descricao:'Todos'},
                    {id:2,descricao:'Demandas/Recursos Comigo'},
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ]
                vm.filtroRecursoDTO.idDemandasComigo = 2;
            }else if( $rootScope.nomePerfil === 'FKSOLUTIONS.AUTORIDADE.MAXIMA' ){
                vm.listaDemandasComigo = [
                    {id:2,descricao:'Demandas/Recursos Comigo'}
                ]
                vm.filtroRecursoDTO.idDemandasComigo = 2;
            }else if ($rootScope.nomePerfil === 'FKSOLUTIONS.PONTO.FOCAL'
                || $rootScope.nomePerfil === 'FKSOLUTIONS.RESPONDENTE'
                || $rootScope.nomePerfil === 'FKSOLUTIONS.TECNICO' || $rootScope.nomePerfil === 'FKSOLUTIONS.AUTORIDADE.HIERARQUICA') {
                vm.listaDemandasComigo = [
                    {id:2,descricao:'Demandas/Recursos Comigo'},
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ]
                vm.filtroRecursoDTO.idDemandasComigo = 2;
            } else if ($rootScope.nomePerfil === 'FKSOLUTIONS.OBSERVADOR.SIC') {
                vm.listaDemandasComigo = [
                    {id:1,descricao:'Todos'}
                ]
                vm.filtroRecursoDTO.idDemandasComigo = 1;
            } else if ($rootScope.nomePerfil === 'FKSOLUTIONS.OBSERVADOR.UNIDADE') {
                vm.listaDemandasComigo = [
                    {id:3,descricao:'Minha Unidade/Subunidade'}
                ]
                vm.filtroRecursoDTO.idDemandasComigo = 3;
            }
        }

        function carregarComboStatusTramitacao() {
            StatusTramitacaoRecursoService.listarStatusTramitacao().then(
                function (successResponse) {
                    vm.listaStatusTramitacaoRecursoDTO = successResponse.data;
                }
            )
        }

        function carregarComboStatusSolicitacao() {
            StatusSolicitacaoRecursoService.listarStatusSolicitacao().then(
                function (successResponse) {
                    vm.listaStatusSolicitacaoDTO = successResponse.data;
                }
            )
        }

        function carregarComboTipoResposta() {
            TipoRespostaRecursoService.listarTipoResposta().then(
                function (successResponse) {
                    vm.listaTipoRespostaDTO = successResponse.data;
                }
            )
        }

        function carregarComboInstanciaRecurso() {
            InstanciaRecursoService.listarInstanciaRecurso().then(
                function (successResponse) {
                    vm.listaInstanciaRecursoDTO = successResponse.data;
                }
            )
        }

        function carregarComboSituacaoRecurso() {
            SituacaoRecursoService.listarSituacaoRecurso().then(
                function (successResponse) {
                    vm.listaSituacaoRecursoDTO = successResponse.data;
                }
            )
        }

        function carregarComboTipoRecurso() {
            TipoRecursoService.listarTipoRecurso().then(
                function (successResponse) {
                    vm.listaTipoRecursoDTO = successResponse.data;
                }
            )
        }

        function limparTabela() {
            vm.listaConsultaRecursoDTO = [];
            vm.totalConsulta = undefined;
            vm.totalPaginasConsulta = undefined;
            vm.totalElementosConsulta = undefined;
        }

        function  carregarConsulta() {
            vm.listaConsultaRecursoDTO = escopoCompartilhadoService.getElementos();
            vm.objeto = escopoCompartilhadoService.getLimites();
            vm.totalElementosConsulta = vm.objeto.total;
            vm.totalPaginasConsulta = vm.objeto.paginas;
            vm.filtroRecursoDTO = escopoCompartilhadoService.getFiltro();
            if(escopoCompartilhadoService.getFlag()){
                vm.paginacao = escopoCompartilhadoService.getPaginacao();
                vm.tabelaConsulta.limit = vm.paginacao.limit;
                vm.tabelaConsulta.limitsPage = vm.paginacao.limitsPage;
                vm.tabelaConsulta.page = vm.paginacao.page;
                _consultar();
                vm.flag = false;
                escopoCompartilhadoService.carregarFlag(vm.flag);

            }


        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _consultar() {
            vm.flag = true;
            vm.filtroRecursoDTO.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.filtroRecursoDTO.limit = angular.copy(vm.tabelaConsulta.limit);
            RecursoService.consultarRecurso(vm.filtroRecursoDTO).then(
                function (successResponse) {
                    if (successResponse.data && successResponse.data.resultado && successResponse.data.resultado.length > 0) {
                        vm.listaConsultaRecursoDTO = successResponse.data.resultado;
                        vm.totalElementosConsulta = successResponse.data.totalElementos;
                        vm.totalPaginasConsulta = successResponse.data.totalPaginas;
                        vm.filtroRecursoDTOConsultaRealizada = angular.copy(vm.filtroRecursoDTO);
                        escopoCompartilhadoService.carregarElementos(vm.listaConsultaRecursoDTO);
                        escopoCompartilhadoService.carregarLimites(vm.totalPaginasConsulta,vm.totalElementosConsulta,vm.tabelaConsulta.page,vm.tabelaConsulta.limit);
                        escopoCompartilhadoService.carregarFiltroConsulta(vm.filtroRecursoDTOConsultaRealizada);
                        escopoCompartilhadoService.carregarPaginacao(vm.tabelaConsulta.limit,vm.tabelaConsulta.limitsPage,vm.tabelaConsulta.page);
                        escopoCompartilhadoService.carregarFlag(vm.flag);
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
                                .textContent("Ocorreu um erro não esperado ao realizar a consulta de recursos.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }
                }
            );
        }

        function _limpar() {
            vm.filtroRecursoDTO = {
                offset: undefined,
                limit: undefined,
                idStatusTramitacao: undefined,
                idStatusSolicitacao: undefined,
                protocolo: undefined,
                idTipoResposta: undefined,
                idUnidade: undefined,
                idSubunidade: undefined,
                periodoInicialDataAbertura: undefined,
                periodoFinalDataAbertura: undefined,
                periodoInicialPrazoAtendimento: undefined,
                periodoFinalPrazoAtendimento: undefined,
                tipoPessoa: undefined,
                idInstanciaRecurso: undefined,
                periodoInicialDecisaoCgu: undefined,
                periodoFinalDecisaoCgu: undefined,
                periodoInicialDecisaoCmri: undefined,
                periodoFinalDecisaoCmri: undefined,
                periodoInicialVencimentoEsic: undefined,
                periodoFinalVencimentoEsic: undefined,
                idSituacaoRecurso: undefined,
                idTipoRecurso: undefined,
                textoSolicitacao: undefined,
                nomeSolicitante: undefined,
                idDemandasComigo: undefined

            };

            vm.prazoVencidoSdsicCheckbox = undefined;
            vm.prazoVencidoEsicCheckbox = undefined;

        }

        function _detalhar(idPedido) {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: idPedido});
        }

        function _gerarRelatorioExcel() {
            RecursoService.gerarRelatorioExcel(vm.filtroRecursoDTOConsultaRealizada).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var nomeArquivo = 'ConsultaRecursos.xls';
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
    }

})();
