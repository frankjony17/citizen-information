(function () {
    'use strict';
    angular.module('sdsicApp').directive('sdsicProrrogacao', sdsicProrrogacao);

    function sdsicProrrogacao(SolicitacaoInformacaoService, MotivoProrrogacaoService, $state, $rootScope, ProrrogarPrazoService, EscopoCompartilhadoPedidoDuplicadoService, MensagensService, $mdToast) {

        return {
            templateUrl: 'scripts/app/directives/templates/sdsic-prorrogacao.html',
            scope: {
                idPedido: '=',
                consulta: '=',
                instancia: '=',
                isEsic: '='
            },
            link: function ($scope) {

                var vm = $scope;

                vm.prorrogacaoDTO = {};
                vm.pedidoDetalhadoDTO = null;
                vm.listaMotivoProrrogacaoDTO = null;
                vm.prorrogacaoCadastroDTO = {};
                vm.tituloDaPagina = $rootScope.tituloPagina;

                function init() {
                    carregarComboMotivoProrrogacao();
                    carregarPedidoDatalhado();
                }

                function carregarComboMotivoProrrogacao() {
                    MotivoProrrogacaoService.listarMotivoProrrogacao().then(
                        function (successResponse) {
                            vm.listaMotivoProrrogacaoDTO = successResponse.data;
                        }
                    )
                }

                function carregarPedidoDatalhado() {
                    SolicitacaoInformacaoService.consultarPedidoDetalhado(vm.idPedido).then(
                        function (successResponse) {
                            vm.pedidoDetalhadoDTO = successResponse.data;
                            vm.novoVencimentoESic = vm.pedidoDetalhadoDTO.vencimentoESic;
                            vm.prorrogadoESic = vm.pedidoDetalhadoDTO.prorrogadoESic;
                            vm.verificarProrrogado();
                            if(vm.isEsic === false){
                                var novoVencimentoUnidade = new Date(vm.pedidoDetalhadoDTO.vencimentoUnidadeProrrodadoSdsic);
                                vm.prorrogacaoCadastroDTO.novoVencimentoUnidade = novoVencimentoUnidade;
                            }else {
                                vm.verificarProrrogadoEsic();
                                if(vm.prorrogadoESic == false) {
                                    var novaPrevisaoEsic = new Date(vm.novoVencimentoESic);
                                    novaPrevisaoEsic.setDate(novaPrevisaoEsic.getDate() + 10);
                                    vm.novoVencimentoESic = novaPrevisaoEsic;
                                }

                            }
                        }
                    );
                }

                vm.salvarProrrogacao = function () {
                    if(vm.formulario.$valid) {
                        vm.prorrogacaoCadastroDTO.idPedido = vm.idPedido;
                        vm.prorrogacaoCadastroDTO.eSic = vm.isEsic;
                        ProrrogarPrazoService.salvarProrrogacao(vm.prorrogacaoCadastroDTO).then(
                            function () {
                                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                                vm.voltarDetalhar();
                            },
                            function () {
                                $mdToast.show(
                                    $mdToast.simple()
                                        .textContent("Ocorreu um erro não esperado ao salvar a prorrogação.")
                                        .hideDelay(3000)
                                );
                            }
                        )
                    } else {
                        if(vm.formulario.textJusticafiva.$error.minlength || vm.formulario.textJusticafiva2.$error.minlength ){
                            MensagensService.exibirmensagemQuantidadeCaracteres2();
                        }else if(vm.formulario.textJusticafiva.$error.maxlength || vm.formulario.textJusticafiva2.$error.maxlength){
                            MensagensService.exibirmensagemQuantidadeMaximaCaracteres();
                        }else{
                            MensagensService.exibirMensagemCamposObrigatorios();
                        }
                        vm.formulario.$setSubmitted();
                    }
                };

                vm.verificarProrrogado = function () {
                    if(vm.pedidoDetalhadoDTO.prorrogado){
                        ProrrogarPrazoService.consultarProrrogacao(vm.idPedido).then(
                            function (successResponse) {
                                vm.prorrogacaoCadastroDTO = successResponse.data;
                            }
                        );
                    }

                };

                vm.verificarProrrogadoEsic = function () {
                    if(vm.pedidoDetalhadoDTO.prorrogadoESic){
                        ProrrogarPrazoService.consultarProrrogacaoEsic(vm.idPedido).then(
                            function (successResponse) {
                                vm.prorrogacaoCadastroDTO = successResponse.data;
                            }
                        );
                    }

                };

                vm.consultarDadosSolicitante = function () {
                    $state.go("dadosSolicitante", { consulta: vm.consulta, instancia: "-", id: vm.idPedido });
                };

                vm.voltar = function () {
                    EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                    $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
                };

                vm.voltarDetalhar = function () {
                    EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
                    $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
                };

                init();
            }
        };
    }
})();
