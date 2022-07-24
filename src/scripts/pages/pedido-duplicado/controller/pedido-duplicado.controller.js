(function () {

    'use strict';

    angular.module('sdsicApp').controller('PedidoDuplicadoController', ['$scope', '$state', '$mdToast', '$log', '$stateParams', 'PedidoDuplicadoService', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', controller]);

    function controller($scope, $state, $mdToast, $log, $stateParams, PedidoDuplicadoService, EscopoCompartilhadoPedidoDuplicadoService, MensagensService) {

        var vm = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        vm.idPedido = $stateParams.idPedido;

        vm.listaPedidoDuplicadoDTO  = undefined;

        vm.pedidoDuplicadoDTO = undefined;

        vm.protocolo = undefined;

        vm.idPedidoDuplicado = undefined;

        function limparTabela() {
            vm.listaPedidoDuplicadoDTO = [];
            vm.totalConsulta = undefined;
            vm.totalPaginasConsulta = undefined;
            vm.totalElementosConsulta = undefined;
        }


        vm.tabelaConsulta = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.consultarPedidoSolicitante = _consultarPedidoSolicitante;

        vm.voltarDetalhePerdido = _voltarDetalhePerdido;

        vm.consultarPedidoPeloProtocolo = _consultarPedidoPeloProtocolo;

        vm.vincularPedidoDuplicado = _vincularPedidoDuplicado;

        vm.responderPedidoInformacao = _responderPedidoInformacao;

        vm.limpar = _limpar;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            _consultarPedidoSolicitante();
            buscarProtocoloPedidoPai();
            EscopoCompartilhadoPedidoDuplicadoService.carregarIdPedidoPai(vm.idPedido);
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("pedidoDuplicado");
        }

        function _consultarPedidoSolicitante() {
            vm.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.limit = angular.copy(vm.tabelaConsulta.limit);
            PedidoDuplicadoService.consultarPedidoSolicitante(vm.idPedido, vm.offset, vm.limit).then(
                function (successResponse) {
                    if (successResponse.data && successResponse.data.content && successResponse.data.content.length > 0) {
                        vm.listaPedidoDuplicadoDTO = successResponse.data;
                        vm.totalElementosConsulta = successResponse.data.totalElements;
                        vm.totalPaginasConsulta = successResponse.data.totalPages;
                        //scope.filtroPedidoDuplicadoDTOConsultaRealizada = angular.copy(scope.filtroPedidoDTO);
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
                                .textContent("Ocorreu um erro não esperado ao realizar a consulta de pedidos duplicados.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }
                }
            );
        }

        function buscarProtocoloPedidoPai() {
            PedidoDuplicadoService.buscarProtocoloPedidoPai(vm.idPedido).then(
                function (successResponse) {
                    vm.pedido = successResponse.data;
                }
            )
        }

        // Implementação de metodos públicos----------------------------------------------------------------------------

        function _voltarDetalhePerdido() {
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        }

        function _consultarPedidoPeloProtocolo() {
            if($scope.pedidoDuplicadoForm.$valid) {
                PedidoDuplicadoService.consultarPedidoPeloProtocolo(vm.protocolo).then(
                    function (successResponse) {
                        vm.pedidoDuplicadoDTO = successResponse.data;
                    }
                );
            } else if ($scope.pedidoDuplicadoForm.textProtocolo.$error.maxlength) {
                MensagensService.exibirMensagemQuantidadeMaximaCaracteresPedidoDuplicado();
            }

        }

        function _vincularPedidoDuplicado () {
            PedidoDuplicadoService.vincularPedidoDuplicado(vm.idPedidoDuplicado, vm.idPedido).then(
                function (successResponse) {
                    if (successResponse.status == 200) {
                        MensagensService.exibirMensagemSucesso("Pedido vinculado com sucesso.");
                    }
                },function (errorResponse) {
                    if (errorResponse.status == 400) {
                        MensagensService.exibirMensagemSucesso("Esse pedido já possui vínculo.");
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Ocorreu um erro não esperado ao realizar o vínculo do pedido duplicado.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }

                }
            );
        }

        function _responderPedidoInformacao () {
            $state.go("responderPedidoInformacao", {fluxo: "pedidoDuplicado", idPedido: vm.idPedidoDuplicado});
        }

        function _limpar () {
            vm.protocolo = undefined;
        }
    }

})();
