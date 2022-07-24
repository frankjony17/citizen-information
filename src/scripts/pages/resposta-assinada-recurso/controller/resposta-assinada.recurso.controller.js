(function () {

    'use strict';

    angular.module('sdsicApp').controller('RespostaAssinadaRecursoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', '$mdDialog', '$rootScope', 'SolicitacaoInformacaoService', 'RespostaAssinadaRecursoService', 'PropostaRespostaRecursoService', 'RecursoService', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $stateParams, $mdDialog, $rootScope, SolicitacaoInformacaoService, RespostaAssinadaRecursoService, PropostaRespostaRecursoService, RecursoService, EscopoCompartilhadoPedidoDuplicadoService, MensagensService) {

        var vm = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        vm.idRecurso = $stateParams.id;

        vm.respostaAssinadaRecursoDTO = {};

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.salvarRespostaRecurso = _salvarRespostaRecurso;

        vm.voltar = _voltar;

        vm.editarRespostaRecurso = _editarRespostaRecurso;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            buscarRespostaRecurso();
            buscarIdPedido();
            consultarStatusRespostaAssinada();
            buscarStatusSolicitacao();
        }

        function buscarRespostaRecurso() {
            RespostaAssinadaRecursoService.buscarRespostaRecurso(vm.idRecurso).then(
                function (response) {
                    vm.resposta = response.data.resposta;
                    if(vm.resposta == null) {
                        setTimeout(function () {
                            CKEDITOR.instances.editor1.setData("Prezado(a) Senhor(a),<hr></br></br><hr>Atenciosamente,");
                        }, 1000);
                        } else {
                        setTimeout(function () {
                            CKEDITOR.instances.editor1.setData(vm.resposta);
                        }, 1000);
                    }
                }
            )
        }

        function buscarIdPedido() {
            PropostaRespostaRecursoService.buscarIdPedido(vm.idRecurso).then(
                function (successResponse) {
                    vm.idPedido = successResponse.data;
                }
            )
        }

        function consultarStatusRespostaAssinada() {
            RecursoService.consultarStatusRespostaAssinada(vm.idRecurso).then(
                function (successResponse) {
                    vm.statusRespostaAssinada = successResponse.data;
                }
            )
        }

        function buscarStatusSolicitacao() {
            PropostaRespostaRecursoService.buscarStatusSolicitacao(vm.idRecurso).then(
                function (successResponse) {
                    vm.statusSolicitacao = successResponse.data;
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _salvarRespostaRecurso(ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/assinatura-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                    respostaAssinadaRecursoDTO: vm.respostaAssinadaRecursoDTO,
                    respostaAssinadaRecursoForm: vm.respostaAssinadaRecursoForm
                },
                controller:['$scope', function ($scope) {
                    if (vm.statusSolicitacao.nome == "Recurso 1ª Produção") {
                        $scope.destinatario = "Destinatário de recurso de segunda instância";
                    } else if (vm.statusSolicitacao.nome == "Recurso 2ª Produção") {
                        $scope.destinatario = "Destinatário de recurso de terceira instância";
                    }

                    $scope.enviar = function () {
                        vm.respostaAssinadaRecursoDTO.idRecurso = vm.idRecurso;
                        vm.respostaAssinadaRecursoDTO.respostaRecurso = CKEDITOR.instances.editor1.getData();
                        if(vm.respostaAssinadaRecursoForm.$valid) {
                            RespostaAssinadaRecursoService.salvarRespostaRecurso(vm.respostaAssinadaRecursoDTO).then(
                                function () {
                                    MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                                    EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                                    $state.go("detalheSolicitacaoInformacao", {idPedido : vm.idPedido}, {}, {reload: true});
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
                            )
                        } else {
                            MensagensService.exibirMensagemCamposObrigatorios();
                            vm.respostaAssinadaRecursoForm.$setSubmitted();
                        }
                    }
                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]


            }).then(function(response) {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
            });
        };

        function _editarRespostaRecurso() {
            if(vm.respostaAssinadaRecursoForm.$valid) {
                vm.respostaAssinadaRecursoDTO.idRecurso = vm.idRecurso;
                vm.respostaAssinadaRecursoDTO.respostaRecurso = CKEDITOR.instances.editor1.getData();
                RespostaAssinadaRecursoService.salvarRespostaRecurso(vm.respostaAssinadaRecursoDTO).then(
                    function () {
                        MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido : vm.idPedido}, {}, {reload: true});
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
                )
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.respostaAssinadaRecursoForm.$setSubmitted();
            }
        }

        vm.confirmarFecharRespostaSemSalvar = function(ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/confirmacao-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: vm.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                },
                controller:['$scope', function ($scope) {
                    $scope.voltar = function () {
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido : vm.idPedido});
                        $mdDialog.cancel();
                    };

                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]


            }).then(function(response) {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
            });
        };

        function _voltar() {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao",{idPedido : vm.idPedido});
        }

        // Implementação de metodos observadores------------------------------------------------------------------------

    }

})();
