(function () {

    'use strict';

    angular.module('sdsicApp').controller('RespostaPedidoController', ['$scope', '$mdDialog', '$stateParams', '$window', '$document', '$log', '$state', '$mdToast', '$q', '$rootScope', '$filter', 'RespostaPedidoService', 'SolicitacaoInformacaoService', 'PedidoDuplicadoService', 'MensagensService', 'EscopoCompartilhadoPedidoDuplicadoService', controller]);

    function controller($scope, $mdDialog, $stateParams, $window, $document, $log, $state, $mdToast, $q, $rootScope, $filter, RespostaPedidoService, SolicitacaoInformacaoService, PedidoDuplicadoService, MensagensService, EscopoCompartilhadoPedidoDuplicadoService) {

        var scope = this;


        // Declaração de variaveis -------------------------------------------------------------------------------------

        scope.idPedido = $stateParams.idPedido;

        scope.fluxoPagina = $stateParams.fluxo;

        scope.respostaPedidoDTO = {};

        scope.fluxo = 'responder';

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        scope.salvarResposta = _salvarResposta;

        scope.editarResposta = _editarResposta;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            buscarRespostaSdsic();
            buscarRespostaPedido();
            consultarStatusRespostaAssinada();
            consultarStatusSolicitacao();
        }

        function consultarStatusSolicitacao() {
            SolicitacaoInformacaoService.consultarStatusSolicitacao(scope.idPedido).then(
                function (successResponse) {
                    scope.statusSolicitacao = successResponse.data;
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        scope.confirmarFecharRespostaSemSalvar = function (ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/confirmacao-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {},
                controller: ['$scope', function ($scope) {
                    $scope.voltar = function () {
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido});
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

        function _editarResposta() {
            scope.respostaPedidoDTO.idPedido = scope.idPedido;
            scope.respostaPedidoDTO.respostaPedido = CKEDITOR.instances.editor1.getData();
            RespostaPedidoService.salvarResposta(scope.respostaPedidoDTO).then(
                function () {
                    MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                    EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                    $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido}, {}, {reload: true});
                },
                function (responseError) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao salvar a resposta.")
                            .hideDelay(3000)
                    );
                    console.log(responseError);
                }
            )
        }

        function _salvarResposta(ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/assinatura-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {},
                controller: ['$scope', function ($scope) {
                    $scope.destinatario = "Destinatário de recurso de primeira instância";
                    RespostaPedidoService.obterAssinatura(scope.idPedido).then(function (response) {
                        var assinatura = response.data.split("#|#");
                        $scope.responsavelResposta = assinatura[0];
                        $scope.destinatarioRecursoPrimeiraInstancia = assinatura[1];
                    }, function (response) {
                        console.log("Erro :", response);
                    });
                    $scope.enviar = function () {
                        scope.respostaPedidoDTO.idPedido = scope.idPedido;
                        scope.respostaPedidoDTO.respostaPedido = CKEDITOR.instances.editor1.getData();
                        RespostaPedidoService.salvarResposta(scope.respostaPedidoDTO).then(
                            function () {
                                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                                EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                                $state.go("detalheSolicitacaoInformacao", {idPedido: scope.idPedido}, {}, {reload: true});
                                $scope.cancelar();
                            },
                            function (responseError) {
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent("Ocorreu um erro não esperado ao salvar a resposta.")
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
            })
        }

        function obterAssinatura (idPedido) {
            RespostaPedidoService.obterAssinatura(idPedido).then(function (response) {
                var assinatura = response.data.split("#|#");
                scope.responsavelResposta = assinatura[0];
                scope.destinatarioRecursoPrimeiraInstancia = assinatura[1];
            }, function (response) {
                console.log("Erro :", response);
            });
        }

        function buscarRespostaPedido() {
            RespostaPedidoService.buscarRespostaPedido(scope.idPedido).then(
                function (successResponse) {
                    scope.respostaPedido = successResponse.data;
                    if (scope.fluxoPagina == "pedidoDuplicado") {
                        PedidoDuplicadoService.buscarPedidoPaiPedidoDuplicado(scope.idPedido).then(
                            function (successResponse) {
                                scope.pedidoPaiPedidoDuplicado = successResponse.data;
                                if (scope.pedidoPaiPedidoDuplicado.statusSolicitacao.nome == "Enviada") {
                                    setTimeout(function () {
                                        CKEDITOR.instances.editor1.setData("Esclarecemos que consta no sistema e-SIC outra demanda sua com o mesmo teor. Desse modo, informamos que a resposta a esta solicitação duplicada foi realizada na data de xx/xx/xxxx, para o protocolo nº " + scope.pedidoPaiPedidoDuplicado.protocolo + ".");
                                    }, 1000);

                                } else {
                                    var vencimentoEsic = new Date(scope.pedidoPaiPedidoDuplicado.prazoAtendimento);
                                    setTimeout(function () {
                                        CKEDITOR.instances.editor1.setData("Esclarecemos que constam no sistema e-SIC outra demanda sua com o mesmo teor. Desse modo, informamos que a resposta a esta solicitação duplicada está sendo processada por meio do protocolo nº " + scope.pedidoPaiPedidoDuplicado.protocolo + " e será respondida em até o dia " + $filter('date')(vencimentoEsic, 'dd/MM/yyyy') + ", salvo se prorrogada por dez dias, mediante justificativa, conforme dispõe os arts. 15 e 16 do Decreto n° 7.724/2012");
                                    }, 1000);
                                }

                            }
                        )

                    } if(scope.respostaSdic.resposta != null) {
                        setTimeout(function () {
                            CKEDITOR.instances.editor1.setData(scope.respostaSdic.resposta);
                        }, 1000);

                    } else if (scope.respostaPedido.respostaEsic == null ) {
                        setTimeout(function () {
                            CKEDITOR.instances.editor1.setData("Prezado(a) Senhor(a),</br>O Serviço de Informações ao Cidadão (SIC) do Ministério do Planejamento, Desenvolvimento e Gestão (MP) agradece o seu contato.<hr></br></br><hr>Atenciosamente ");
                        }, 1000);
                    }  else {
                        setTimeout(function () {
                            CKEDITOR.instances.editor1.setData(scope.respostaPedido.respostaEsic);
                        }, 1000);
                    }
                },
                function (responseError) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao buscar a resposta para edição.")
                            .hideDelay(3000)
                    );
                    console.log(responseError);
                }
            );
        }

        function consultarStatusRespostaAssinada() {
            SolicitacaoInformacaoService.consultarStatusRespostaAssinada(scope.idPedido).then(
                function (successResponse) {
                    scope.statusRespostaAssinada = successResponse.data;
                }
            )
        }

        function buscarRespostaSdsic() {
            RespostaPedidoService.buscarRespostaSdsicSalva(scope.idPedido).then(
                function (successResponse) {
                    scope.respostaSdic = successResponse.data;
                }
            )
        }



        // Implementação de metodos observadores------------------------------------------------------------------------
    }

})();
