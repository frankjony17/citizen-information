(function () {

    'use strict';

    angular.module('sdsicApp').controller('DetalheRecursoController', ['$scope', '$mdDialog', '$stateParams', '$window', '$document', '$log', '$state', '$mdToast', 'SolicitacaoInformacaoService', 'EnviarPedidoRevisaoService', 'MensagensService', 'FinalizarEouvService', 'AndamentoPedidoService', 'HistoricoRecursoService', 'RespostaPedidoService', 'AndamentoRecursoService', 'RecursoService', controller]);

    function controller($scope, $mdDialog, $stateParams, $window, $document, $log, $state, $mdToast, SolicitacaoInformacaoService, EnviarPedidoRevisaoService, MensagensService, FinalizarEouvService, AndamentoPedidoService, HistoricoRecursoService, RespostaPedidoService, AndamentoRecursoService, RecursoService) {

        var vm = this;

        vm.abas = {
            selectedIndex: 0
        };


        // Declaração de variaveis -------------------------------------------------------------------------------------

        vm.idRecurso = $stateParams.id;

        vm.recursoDetalhadoDTO = {};

        vm.listaAndamentoPedidoDTO = {};

        vm.listaHistoricoPedidoDTO = {};

        vm.responsavelResposta = undefined;

        vm.destinatarioRecursoPrimeiraInstancia = undefined;


        vm.fluxo = 'responder';

        vm.historicoTratamento = {};

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

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.consultarDadosSolicitante = _consultarDadosSolicitante;

        vm.encaminharRecurso = encaminharRecurso;

        vm.enviarResposta = _enviarResposta;

        vm.voltar = _voltar;

        vm.voltarAbaRecurso = _voltarAbaRecurso;

        vm.devolver = _devolver;

        vm.responder = _responder;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            carregarRecursoDetalhado();
            carregarAndamentoRecurso();
            carregarHistoricoRecurso();
            consultarDataRespostaRecurso();
        }

        function carregarRecursoDetalhado() {
            RecursoService.consultarDetalheRecurso(vm.idRecurso).then(
                function (successResponse) {
                    vm.recursoDetalhadoDTO = successResponse.data;
                }
            );
        }

        function carregarAndamentoRecurso() {
            vm.offset = angular.copy(vm.tabelaConsultaAndamento.page - 1);
            vm.limit = angular.copy(vm.tabelaConsultaAndamento.limit);
            AndamentoRecursoService.consultarAndamentoRecurso(vm.idRecurso, vm.offset, vm.limit).then(
                function (successResponse) {
                    vm.listaAndamentoRecursoDTO = successResponse.data;
                    vm.totalElementosConsultaAndamento = successResponse.data.totalElements;
                    vm.totalPaginasConsultaAndamento = successResponse.data.totalPages;
                }
            );
        }

        function carregarHistoricoRecurso() {
            vm.offset = angular.copy(vm.tabelaConsultaHistorico.page - 1);
            vm.limit = angular.copy(vm.tabelaConsultaHistorico.limit);
            HistoricoRecursoService.consultarHistoricoRecurso(vm.idRecurso, vm.offset, vm.limit).then(
                function (successResponse) {
                    vm.listaHistoricoRecursoDTO = successResponse.data;
                    vm.totalElementosConsultaHistorico = successResponse.data.totalElements;
                    vm.totalPaginasConsultaHistorico = successResponse.data.totalPages;
                }
            );
        }

        function consultarDataRespostaRecurso() {
            HistoricoRecursoService.consultarDataRespostaRecurso(vm.idRecurso).then(
                function (successResponse) {
                    vm.dataRespostaRecurso = successResponse.data;
                }
            );
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _consultarDadosSolicitante() {
            $state.go("dadosSolicitante", {consulta: "recurso", id: vm.idRecurso});
        }

        function _voltarAbaRecurso() {
            vm.abas.selectedIndex = 0;

        }

        vm.visualizarHistoricoRecurso = function (ev, id) {
            $mdDialog.show({
                templateUrl: 'scripts/pages/recurso/view/historico-recurso-dialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: vm.customFullscreen, // Only for -xs, -sm breakpoints.
                locals: {
                },
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

        function encaminharRecurso() {
            $state.go("propostaRespostaRecurso", {idRecurso: vm.idRecurso});

            /*else {
               resposta = 'encaminharSic';
               $state.go("respostaAssinada", {idPedido: vm.idPedido, resposta: resposta});
           }*/
        }

        function _enviarResposta() {
            $state.go("enviarResposta", {id: vm.idRecurso});
        }

        function _responder() {
            $state.go("respostaAssinadaRecurso", {id: vm.idRecurso});
        }

        function _devolver() {
            $state.go("devolverRecurso", {id: vm.idRecurso});
        }

        function _voltar() {
            $state.go("consultarRecurso");
        }

        // Implementação de metodos observadores------------------------------------------------------------------------

    }

})();
