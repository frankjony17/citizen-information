(function () {

    'use strict';

    angular.module('sdsicApp').controller('PropostaRespostaController', ['$element', '$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', '$rootScope', 'SolicitacaoInformacaoService', 'PropostaRespostaService', 'MensagensService', '$mdDialog', 'RespostaAssinadaService', 'EscopoCompartilhadoPedidoDuplicadoService', 'UnidadeService', 'UsuarioService', controller]);

    function controller($element, $scope, $window, $document, $log, $state, $mdToast, $stateParams, $rootScope, SolicitacaoInformacaoService, PropostaRespostaService, MensagensService, $mdDialog, RespostaAssinadaService, EscopoCompartilhadoPedidoDuplicadoService, UnidadeService, UsuarioService) {

        var scope = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        scope.idPedido = $stateParams.idPedido;

        scope.nomeStatusSolicitacao = undefined;

        scope.propostaRespostaDTO = {
            idPedido: undefined,
            observacao: undefined,
            idStatusSolicitacao: undefined,
            nomeStatusSolicitacao: undefined,
            listaUnidade: [{}]
        };

        scope.searchTerm;

        scope.listaTabela = [];

        scope.listaRespondente = [];

        scope.clearSearchTerm = _clearSearchTerm;

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        scope.enviar = _enviar;

        scope.voltar = _voltar;

        scope.escreverPropostaResposta = _escreverPropostaResposta;

        scope.buscarUsuarioPontoFocalPorSubunidade = _buscarUsuarioPontoFocalPorSubunidade;

        scope.valideFormulario = function() { // remova a linha vermelha.
            $scope.formulario.unidade.$setValidity('required', true);
        };
        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            buscarDadosEncaminhamento();
            buscar();
        }

        function buscarDadosEncaminhamento() {
            PropostaRespostaService.buscarDadosEncaminhamento(scope.idPedido).then(function (successResponse) {
                scope.propostaRespostaDTO = successResponse.data;
                scope.propostaRespostaDTO.idPedido = scope.idPedido;
                if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Triagem SIC") {
                    buscarUnidades();
                } else if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Distribuição PF") {
                    buscarSubunidades();
                } else if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Produção de Resposta") {
                    buscarUsuarioTecnicoPorSubunidade();
                    buscarSubunidades();
                } else if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Sugestão de Reencaminhamento") {
                    buscarUsuarioTecnicoPorSubunidade();
                }
                console.log(scope.propostaRespostaDTO);
            });
        }

        scope.addTabela = function () {
            scope.listaTabela.push(scope.propostaRespostaDTO.listaUnidade);
        };

        scope.addTabelaTecnico = function () {
            scope.listaTabela.push(scope.propostaRespostaDTO.listaUsuarioAcessos);
        };

        scope.addSubunidadeRespondenteTabela = function () {
            scope.listaTabela.push(scope.propostaRespostaDTO.listaSubunidade);
            scope.listaTabela[scope.listaTabela.length - 1].respondente = scope.propostaRespostaDTO.listaUsuarioAcessos;
            scope.listaRespondente.push(scope.propostaRespostaDTO.listaUsuarioAcessos);
        };

        scope.removeTabela = function (id) {
            var indice;
            for (var i = 0; i < scope.listaTabela.length; i++) {
                if (scope.listaTabela[i].id == id) {
                    indice = i;
                    break;
                }
            }
            scope.listaTabela.splice(indice, 1);

        };

        function _clearSearchTerm() {
            scope.searchTerm = '';
        }

        function buscarUnidades() {
            UnidadeService.buscarListaUnidade().then(
                function (success) {
                    scope.listaUnidade = success.data;
                    scope.copiaUnidade = angular.copy(scope.listaUnidade);
                    if (scope.propostaRespostaDTO.nomeStatusSolicitacao == "Distribuição PF") {
                        scope.copiaUnidade = angular.copy(scope.listaUnidade);
                        for (var i = 0; i < scope.copiaUnidade.length; i++) {
                            if (scope.copiaUnidade[i].nomeUnidade == 'SIC') {
                                scope.copiaUnidade.splice(i, 1);
                                break;
                            }
                        }
                    }

                }
            )
        }

        function buscarSubunidades() {
            UnidadeService.buscarListaSubunidadePorUsuarioLogado().then(
                function (success) {
                    scope.listaSubunidade = success.data;
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _enviar() {
            if (scope.propostaRespostaDTO.listaUnidade || scope.propostaRespostaDTO.listaUsuarioAcessos || scope.propostaRespostaDTO.listaSubunidade || scope.propostaRespostaDTO.nomeStatusSolicitacao == 'Resposta SIC' ||scope.propostaRespostaDTO.nomeStatusSolicitacao == 'Para Envio') {
                if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Triagem SIC"
                    || scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Sugestão de Reencaminhamento") {
                    scope.propostaRespostaDTO.listaUnidade = [scope.propostaRespostaDTO.listaUnidade];
                } else if (scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Distribuição PF"
                    || scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Produção de Resposta"
                    || scope.propostaRespostaDTO.nomeStatusSolicitacaoPedido == "Resposta Assinada") {
                    scope.propostaRespostaDTO.listaSubunidade = [scope.propostaRespostaDTO.listaSubunidade];
                    scope.propostaRespostaDTO.listaUsuarioAcessos = [scope.propostaRespostaDTO.listaUsuarioAcessos];
                }
                console.log(scope.propostaRespostaDTO)
                PropostaRespostaService.enviar(scope.propostaRespostaDTO).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
                    },
                    function (errorResponse) {
                        if (errorResponse.data && errorResponse.data.errorMessage) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent(errorResponse.data.errorMessage)
                                    .hideDelay(3000)
                            );
                        } else {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("Ocorreu um erro não esperado ao enviar a proposta de resposta.")
                                    .hideDelay(3000)
                            );
                        }
                    }
                );
            } else {
                $scope.formulario.unidade.$setValidity('required', false); // remova a linha vermelha.
                MensagensService.exibirMensagemCamposObrigatorios();
                $scope.formulario.$setSubmitted();
            }

        }

        function buscar() {
            if (scope.idPedido != null) {
                RespostaAssinadaService.buscarResposta(scope.idPedido).then(
                    function (response) {
                        scope.editarResposta = response.data;
                        verificaSePedidoPossuiResposta();
                    }
                )
            }
        }

        function verificaSePedidoPossuiResposta() {
            if (scope.editarResposta.propostaResposta == null) {
                setTimeout(function () {
                    scope.CKEDITOR.instances['editor1'].setData("Prezado(a) Senhor(a),</br>O Serviço de Informações ao Cidadão (SIC) do Ministério do Planejamento, Desenvolvimento e Gestão (MP) agradece o seu contato.<hr></br></br><hr>Atenciosamente,");
                }, 1000);
            } else {
                setTimeout(function () {
                    CKEDITOR.instances['editor1'].setData(scope.editarResposta.propostaResposta);
                }, 1000);
            }
            setTimeout(function () {
                CKEDITOR.instances['editor1'].updateElement();
            }, 1000);
        }

        $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
            buscar();
        });

        function _buscarUsuarioPontoFocalPorSubunidade() {
            UsuarioService.buscarUsuarioPontoFocalPorSubunidade(scope.propostaRespostaDTO.listaSubunidade.id).then(
                function (success) {
                    scope.respondente = success.data;
                }
            )
        }

        function buscarUsuarioTecnicoPorSubunidade() {
            UsuarioService.buscarUsuarioTecnicoPorSubunidade().then(
                function (success) {
                    scope.listaTecnico = success.data;
                }
            )
        }

        function _escreverPropostaResposta() {
            $state.go("responderPedidoInformacaoPropostaResposta", { idPedido: scope.idPedido });
        }

        function _voltar() {
            if (scope.propostaRespostaDTO.propostaResposta != null) {
                PropostaRespostaService.excluirRespostaSdsic(scope.idPedido).then(
                    function (successResponse) {
                    }
                )
            }

            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
        }

        // Implementação de metodos observadores------------------------------------------------------------------------

        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });
    }

})();
