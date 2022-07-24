(function () {
    'use strict';

    angular.module('sdsicApp').controller('ClassificarRespostaSicController', ['$state', '$stateParams', 'CategoriaService', 'SubCategoriaService', 'ClassificacaoTipoRespostaService', 'TipoRespostaService', 'RespostaService', 'HistoricoPedidoService', '$mdDialog', '$scope', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService','SolicitacaoInformacaoService', controller]);

    function controller($state, $stateParams, CategoriaService, SubCategoriaService, ClassificacaoTipoRespostaService, TipoRespostaService, RespostaService, HistoricoPedidoService, $mdDialog, $scope, EscopoCompartilhadoPedidoDuplicadoService, MensagensService,SolicitacaoInformacaoService) {

        var vm = this;

        vm.listaSubCategoria = [];
        vm.listaCategoria = [];
        vm.listaTipoResposta = [];
        vm.listaClassificacaoTipoResposta = [];
        vm.classificacaoRespostaSic = {};
        vm.classificacaoRespostaSic.palavrasChaves = [];
        vm.idPedido = $stateParams.idPedido;
        vm.responsavelResposta = 'Cargo do Usuario';
        vm.destinatarioRecursoPrimeiraInstancia = 'Nome do Destinatário';
        vm.classificacaoRespostaSic.numeroPagina = undefined;
        vm.editarResposta = _editarResposta;

        $scope.historicoTratamento = {};

        vm.tabelaConsultaHistorico = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };

        vm.tabelaConsultaAndamento = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };

        vm.carregarHistoricoPedido = carregarHistoricoPedido;

        function init() {
            carregarTodasCategorias();
            carregarTodosTiposResposta();
            vm.buscarResposta();
            defineTituloDaPagina();
            carregarHistoricoPedido();
            buscarTodasPalavrasChaves();
        }


        vm.newPalavraChave = function (chip) {
            return {descricao: chip};
        };

        function buscarTodasPalavrasChaves(){
            SolicitacaoInformacaoService.buscarTodosTemasSubtemasPalavraChavePedido(vm.idPedido).then(
                function (response) {
                    vm.classificacaoRespostaSic.palavrasChaves = response.data.palavraChaveList;
                }
            )
        }

        vm.buscarSubCategorias = function () {
                SubCategoriaService.buscarPorCategoria(vm.classificacaoRespostaSic.categoria.id).then(
                    function (sucessResponse) {
                        vm.listaSubCategoria = sucessResponse.data.resultado;
                        buscarClassificacaoRespostaESic();
                    })

        };

        function carregarTodasCategorias() {
                CategoriaService.buscarTodasCategorias().then(
                    function (sucessResponse) {
                        vm.listaCategoria = sucessResponse.data.resultado;
                    }
                );
        }

        function carregarTodosTiposResposta() {

                TipoRespostaService.buscarTodosTiposResposta().then(
                    function (sucessResponse) {
                        vm.listaTipoResposta = sucessResponse.data.resultado;
                    }
                );
        }


        vm.buscarClassificacaoPorTipoResposta = function () {
            ClassificacaoTipoRespostaService.buscarPorTipoResposta(vm.classificacaoRespostaSic.tipoResposta.id).then(
                function (sucessResponse) {
                    vm.listaClassificacaoTipoResposta = sucessResponse.data.resultado;
                })
        };

        vm.buscarResposta = function () {
            RespostaService.buscarResposta(vm.idPedido).then(
                function (sucessResponse) {
                    vm.buscaResposta = sucessResponse.data;

                }
            )

        };


        function carregarHistoricoPedido() {
            vm.offset = angular.copy(vm.tabelaConsultaHistorico.page - 1);
            vm.limit = angular.copy(vm.tabelaConsultaHistorico.limit);
            HistoricoPedidoService.consultarHistoricoPedido(vm.idPedido, vm.offset, vm.limit).then(
                function (successResponse) {
                    vm.listaHistoricoPedidoDTO = successResponse.data;
                    vm.totalElementosConsultaHistorico = successResponse.data.totalElements;
                    vm.totalPaginasConsultaHistorico = successResponse.data.totalPages;
                }
            );
        }

        vm.concluir = function () {
            if(vm.classificarRespostaForm.$valid) {
                vm.classificacaoRespostaSic.id = vm.idPedido;
                ClassificacaoTipoRespostaService.salvarClassificacaoRespostaSic(vm.classificacaoRespostaSic).then(
                    function () {
                        MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                        vm.voltarDetalhar();
                    }
                )
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.classificarRespostaForm.$setSubmitted();
            }
        };

        vm.visualizarHistoricoEdicao = function (ev, id) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/historico-pedido-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: vm.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    pedidoDetalhadoDTO: vm.pedidoDetalhadoDTO
                },
                controller: ['$scope', 'pedidoDetalhadoDTO', function ($scope, pedidoDetalhadoDTO) {
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

        function defineTituloDaPagina() {
            var possuiClassificacao;
            ClassificacaoTipoRespostaService.verificaSePossuiClassificacaoRespostaESic(vm.idPedido).then(
                function (response) {
                    possuiClassificacao = response.data;
                    if (possuiClassificacao) {
                        vm.tituloPagina = "Editar Classificação da Resposta e-SIC";
                        buscarClassificacaoRespostaESic();
                    } else {
                        vm.tituloPagina = "Classificar Resposta e-SIC";
                    }
                }
            )
        }

        function buscarClassificacaoRespostaESic() {
            ClassificacaoTipoRespostaService.buscarClassificacaoRespostaESic(vm.idPedido).then(
                function (response) {
                    var classificacaoRespostaESic = response.data;
                    vm.classificacaoRespostaSic.numeroPagina = classificacaoRespostaESic.numeroPagina;
                    vm.classificacaoRespostaSic.restricaoConteudo = classificacaoRespostaESic.restricaoConteudo;
                    vm.listaTipoResposta.forEach(function (tipoResposta) {
                        if (tipoResposta.id == classificacaoRespostaESic.tipoResposta.id) {
                            vm.classificacaoRespostaSic.tipoResposta = tipoResposta;
                        }
                    });

                    ClassificacaoTipoRespostaService.buscarPorTipoResposta(vm.classificacaoRespostaSic.tipoResposta.id).then(
                        function (sucessResponse) {
                            vm.listaClassificacaoTipoResposta = sucessResponse.data.resultado;
                            vm.listaClassificacaoTipoResposta.forEach(function (classificacaoTipoResposta) {
                                if (classificacaoTipoResposta.id == classificacaoRespostaESic.classificacaoTipoResposta.id) {
                                    vm.classificacaoRespostaSic.classificacaoTipoResposta = classificacaoTipoResposta;
                                }
                            });
                        });

                    vm.listaCategoria.forEach(function (categoria) {
                        if (categoria.id == classificacaoRespostaESic.categoria.id) {
                            vm.classificacaoRespostaSic.categoria = categoria;
                        }
                    });
                    SubCategoriaService.buscarPorCategoria(vm.classificacaoRespostaSic.categoria.id).then(
                        function (sucessResponse) {
                            vm.listaSubCategoria = sucessResponse.data.resultado;
                            vm.listaSubCategoria.forEach(function (subcategoria) {
                                if (subcategoria.id == classificacaoRespostaESic.subcategoria.id) {
                                    vm.classificacaoRespostaSic.subcategoria = subcategoria;
                                }
                            });
                        }
                    );
                }
            )
        }

        function _editarResposta() {
            $state.go("editarResposta", {idPedido: vm.idPedido});
        }

        vm.limparEscopo = function () {
            vm.classificarRespostaSic = {};
        };

        vm.voltarConsultaPedidoInformacao = function () {
            $state.go("solicitacaoInformacao");
        };

        vm.voltarDetalhar = function () {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        };

        init();
    }

})();
