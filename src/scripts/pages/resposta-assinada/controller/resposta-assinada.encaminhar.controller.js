(function () {
    'use strict';
    angular.module('sdsicApp').controller('RespostaAssinadaController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', '$mdDialog', '$rootScope', 'SolicitacaoInformacaoService', 'RespostaAssinadaService', 'EscopoCompartilhadoPedidoDuplicadoService', 'UnidadeService', 'MensagensService', controller]);
    function controller($scope, $window, $document, $log, $state, $mdToast, $stateParams, $mdDialog, $rootScope, SolicitacaoInformacaoService, RespostaAssinadaService, EscopoCompartilhadoPedidoDuplicadoService, UnidadeService, MensagensService) {
        var scope = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        scope.idPedido = $stateParams.idPedido;
        scope.resposta = $stateParams.resposta;
        $log.log($stateParams);
        $log.log(scope.resposta);
        scope.unidade = 'SIC';
        scope.respostaAssinadaDTO = {
            idPedido: null,
            idStatusSolicitacao: null,
            nomeStatusSolicitacao: null,
            nomeStatusSolicitacaoPedido: null,
            observacao: null,
            propostaResposta: null,
            subunidade: null,
            unidade: null,
            resposta: scope.resposta
        };
        scope.fluxo = "propostaResposta";
        // Declaração de metodos publicos-------------------------------------------------------------------------------
        scope.voltar = _voltar;
        scope.salvarPropostaResposta = salvarPropostaResposta;
        scope.escreverPropostaResposta = escreverPropostaResposta;

        // Inicialização da controller----------------------------------------------------------------------------------
        init();
        // Implementação de metodos privados----------------------------------------------------------------------------
        function init() {
            editar();
            buscarDadosEncaminhamento();
        }

        function buscarDadosEncaminhamento() {
            RespostaAssinadaService.buscarDadosEncaminhamento(scope.idPedido).then(
                function (successResponse) {
                    scope.respostaAssinadaDTO = successResponse.data;
                    scope.respostaAssinadaDTO.idPedido = scope.idPedido;
                    if(scope.respostaAssinadaDTO.nomeStatusSolicitacaoPedido === "Produção de Resposta") {
                        buscarUnidadeVinculadaASubunidade();
                    } else if(scope.respostaAssinadaDTO.nomeStatusSolicitacaoPedido === "Edição Técnico") {
                        buscarSubunidadeRespondente();
                    } else if(scope.respostaAssinadaDTO.nomeStatusSolicitacaoPedido === "Revisão") {
                        buscarUnidadeSic();
                    } else {
                        buscarUnidadeSic();
                    }
                }
            );
        }

        function buscarUnidadeVinculadaASubunidade() {
            UnidadeService.buscarUnidadeVinculadaASubunidade(scope.idPedido).then(
                function (success) {
                    scope.respostaAssinadaDTO.unidade = success.data;
                }
            )
        }

        function buscarSubunidadeRespondente() {
            UnidadeService.buscarSubunidadeRespondente().then(
                function (success) {
                    scope.respostaAssinadaDTO.subunidade = success.data;
                }
            )
        }

        function buscarUnidadeSic() {
            UnidadeService.buscarUnidadeSic().then(
                function (success) {
                    scope.respostaAssinadaDTO.unidade = success.data;
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function salvarPropostaResposta() {
            var propostaResposta = CKEDITOR.instances.editor1.getData();
            RespostaAssinadaService.salvar(propostaResposta, scope.idPedido).then(
                function (successResponse) {
                    scope.respostaAssinadaDTO = successResponse.data;
                    voltarProposta();
                }
            )
        }

        function editar() {
            if ($stateParams.idPedido != null) {
                RespostaAssinadaService.buscarResposta($stateParams.idPedido).then(
                    function (response) {
                        scope.editarResposta = response.data;
                            setTimeout(function () {
                                if (CKEDITOR.instances.editor1 != undefined) {
                                    CKEDITOR.instances.editor1.setData("Prezado(a) Senhor(a),</br>O Serviço de Informações ao Cidadão (SIC) do Ministério do Planejamento, Desenvolvimento e Gestão (MP) agradece o seu contato.<hr></br></br><hr>Atenciosamente,");
                                }
                            }, 1000);
                    }
                )
            }
        }

        scope.irEditar = function (idPedido) {
            $state.go("editarPropostaResposta", {idPedido: idPedido});
        };

        scope.confirmarFecharRespostaSemSalvar = function (ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/confirmacao-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: scope.customFullscreen,
                locals: {},
                controller: ['$scope', function ($scope) {
                    $scope.voltar = function () {
                        console.log(scope.resposta);
                        voltarProposta();
                        $mdDialog.cancel();
                    };
                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]
            }).then(function () {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
            });
        };

        scope.enviar = function () {
            RespostaAssinadaService.enviar(scope.respostaAssinadaDTO).then(
                function () {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Dados enviados com sucesso.")
                            .hideDelay(3000)
                    );
                    EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                    $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
                    $scope.cancelar();
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
                                .textContent("Ocorreu um erro não esperado ao enviar a resposta assinada.")
                                .hideDelay(3000)
                        );
                    }
                }
            ).then(function () {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
            });
        };

        function escreverPropostaResposta() {
            $state.go("responderPedidoInformacaoPropostaResposta", { idPedido: scope.idPedido });
        }

        function _voltar() {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
        }

        function voltarProposta () {
            if (scope.resposta === null || angular.isUndefined(scope.resposta)) {
                $state.go("propostaResposta", { idPedido: scope.idPedido });
            } else {
                $state.go("respostaAssinada", {idPedido: scope.idPedido, resposta: 'encaminharSic'});
            }
        }
    }

})();
