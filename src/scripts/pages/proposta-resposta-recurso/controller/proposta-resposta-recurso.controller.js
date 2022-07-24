(function () {
    'use strict';
    angular.module('sdsicApp').controller('PropostaRespostaRecursoController', ['RespostaAssinadaRecursoService', 'PropostaRespostaRecursoService', 'UnidadeService', '$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', '$rootScope', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', '$mdDialog','UsuarioService', controller]);
    function controller(RespostaAssinadaRecursoService, PropostaRespostaRecursoService, UnidadeService, $scope, $window, $document, $log, $state, $mdToast, $stateParams, $rootScope, EscopoCompartilhadoPedidoDuplicadoService, MensagensService, $mdDialog,UsuarioService) {
        var vm = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        vm.idRecurso = $stateParams.idRecurso;
        vm.nomeStatusSolicitacao = undefined;
        vm.StatusSolicitacaoRecursoDTO = {};
        vm.propostaRespostaRecursoDTO = {
            idRecurso: undefined,
            observacao: undefined,
            idStatusSolicitacaoRecurso: undefined,
            idUnidade: undefined,
            propostaResposta: undefined,
            resposta: $stateParams.resposta,
            usuarioAcessosList: undefined
        };
        vm.ultimaUnidade = {};
        vm.usuarios = [];
        vm.autoridadeHierarquicaList = [];
        vm.autoridadeMaximaList = [];
        vm.instanciaRecurso = undefined;

        // Declaração de metodos publicos-------------------------------------------------------------------------------
        vm.enviar = enviar;
        vm.voltar = _voltar;
        vm.escreverPropostaRespostaRecurso = _escreverPropostaRespostaRecurso;
        vm.salvarPropostaRespostaRecurso = salvarPropostaRespostaRecurso;

        // Inicialização da controller----------------------------------------------------------------------------------
        vm.fluxo = "propostaRespostaRecurso";

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------
        function init() {
            buscar();
            buscarListaUnidade();
        }

        function buscarUsuarioAutoridadeHierarquicaPorUnidade() {
            UsuarioService.buscarUsuarioAutoridadeHierarquicaPorUnidade(vm.propostaRespostaRecursoDTO.idUnidade).then(
                function (sucessResponse) {
                    vm.usuarios = sucessResponse.data;
                }
            )

        }

        function buscarUsuarioAutoridadeMaximaPorUnidade() {
            UsuarioService.buscarUsuarioAutoridadeMaximaPorUnidade(vm.propostaRespostaRecursoDTO.idUnidade).then(
                function (sucessResponse) {
                    vm.autoridadeHierarquicaList = sucessResponse.data;
                }
            )

        }

        function carregarRecursoDetalhado() {
            PropostaRespostaRecursoService.buscarStatusSolicitacao(vm.idRecurso).then(
                function (successResponse) {
                    vm.StatusSolicitacaoRecursoDTO = successResponse.data;
                    vm.propostaRespostaRecursoDTO.idRecurso = vm.idRecurso;
                    if (vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 1ª Triagem" &&  vm.ultimaUnidade.nomeUnidade != 'SIC') {
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 1ª Distribuição PF";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 2;
                    } else if (vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 1ª Distribuição PF" || vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 1ª Triagem" && vm.ultimaUnidade.nomeUnidade == 'SIC') {
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 1ª Produção";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 3;
                    } else if (vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 1ª Para Revisão") {
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 1ª Para Envio";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 7;
                    }
                    else if(vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 2ª Triagem" &&  vm.ultimaUnidade.nomeUnidade != 'SIC'){
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 2ª Distribuição PF";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 10;
                    }else if (vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 2ª Distribuição PF" ||  vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 2ª Triagem" && vm.ultimaUnidade.nomeUnidade == 'SIC') {
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 2ª Produção";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 11;
                    } else if (vm.StatusSolicitacaoRecursoDTO.nome == "Recurso 2ª Para Revisão") {
                        vm.propostaRespostaRecursoDTO.nome = "Recurso 2ª Para Envio";
                        vm.propostaRespostaRecursoDTO.idStatusSolicitacaoRecurso = 15;
                    }
                }
            );
        }

        function buscarIdPedido() {
            PropostaRespostaRecursoService.buscarIdPedido(vm.idRecurso).then(
                function (successResponse) {
                    vm.idPedido = successResponse.data;
                    PropostaRespostaRecursoService.buscarUltimaUnidade(vm.idPedido).then(
                        function (sucess) {
                            vm.ultimaUnidade = sucess.data;
                            carregarRecursoDetalhado();
                            //verificaSeRecursoPossuiResposta();
                            for(var i = 0;i < vm.listaUnidade.length; i++){
                                if(vm.listaUnidade[i].id == vm.ultimaUnidade.id){
                                        vm.propostaRespostaRecursoDTO.idUnidade = vm.listaUnidade[i].id;
                                    PropostaRespostaRecursoService.buscarInstanciaRecurso(vm.idRecurso).then(
                                        function (response) {
                                            vm.instanciaRecurso = response.data;
                                            if(vm.instanciaRecurso == 1){
                                                buscarUsuarioAutoridadeHierarquicaPorUnidade();

                                            }else if(vm.instanciaRecurso == 2){
                                                buscarUsuarioAutoridadeMaximaPorUnidade();
                                            }
                                        }
                                    )


                                }
                            }

                        }
                    )

                }
            )
        }

        function buscarListaUnidade() {
            UnidadeService.buscarListaUnidade(vm.idRecurso).then(
                function (successResponse) {
                    vm.listaUnidade = successResponse.data;
                    buscarIdPedido();
                }
            )
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function salvarPropostaRespostaRecurso() {
            vm.propostaRespostaRecursoDTO.idRecurso = vm.idRecurso;
            vm.propostaRespostaRecursoDTO.respostaRecurso = CKEDITOR.instances.editor1.getData();
            var propostaResposta = CKEDITOR.instances.editor1.getData();
            PropostaRespostaRecursoService.salvarPropostaRespostaRecurso(propostaResposta, vm.idRecurso).then(
                function (successResponse) {
                    vm.propostaRespostaRecursoDTO = successResponse.data;
                    $state.go("propostaRespostaRecurso", {idRecurso: vm.idRecurso});
                }
            )
        }

        function enviar() {
            if ($scope.formulario.$valid) {
                if(vm.propostaRespostaRecursoDTO.usuarioAcessosList != undefined){
                    vm.propostaRespostaRecursoDTO.usuarioAcessosList = [vm.propostaRespostaRecursoDTO.usuarioAcessosList];
                }
                PropostaRespostaRecursoService.enviar(vm.propostaRespostaRecursoDTO).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                        $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
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
                MensagensService.exibirMensagemCamposObrigatorios();
                $scope.formulario.$setSubmitted();
            }

        }

        function buscar() {
            if (vm.idRecurso != null) {
                PropostaRespostaRecursoService.buscarRespostaRecurso(vm.idRecurso).then(
                    function (response) {
                        vm.editarRespostaRecurso = response.data;

                    }
                )
            }
        }

        // function verificaSeRecursoPossuiResposta() {
        //     if (vm.editarRespostaRecurso.resposta == null) {
        //         setTimeout(function () {
        //             CKEDITOR.instances.editor1.setData("Prezado(a) Senhor(a),</br><hr></br></br><hr>Atenciosamente,");
        //         }, 1000);
        //     } else {
        //         setTimeout(function () {
        //             CKEDITOR.instances.editor1.setData(vm.editarRespostaRecurso.resposta);
        //         }, 1000);
        //     }
        // }

        vm.confirmarFecharRespostaSemSalvar = function (ev) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/solicitacao-informacao/view/confirmacao-resposta-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: vm.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {},
                controller: ['$scope', function ($scope) {
                    $scope.voltar = function () {
                        $state.go("propostaRespostaRecurso", {idRecurso: vm.idRecurso});
                        $mdDialog.cancel();
                    };

                    $scope.cancelar = function () {
                        $mdDialog.cancel();
                    }

                }]


            }).then(function (response) {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
            });
        };

        function _escreverPropostaRespostaRecurso() {
            $state.go("responderRecursoPropostaResposta", {idRecurso: vm.idRecurso});
        }

        function _voltar() {
            if (vm.editarRespostaRecurso.resposta != null) {
                PropostaRespostaRecursoService.excluirRespostaSdsic(vm.idRecurso).then()
            }
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        }
    }
})();
