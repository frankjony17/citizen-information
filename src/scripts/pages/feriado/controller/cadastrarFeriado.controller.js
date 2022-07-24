(function () {
    'use strict';

    angular.module('sdsicApp').controller('CadastrarFeriadoController', ['$log', '$mdToast', '$stateParams', '$state', 'FeriadoService', 'MensagensService', controller]);

    function controller($log, $mdToast, $stateParams, $state, FeriadoService, MensagensService) {

        var vm = this;

        vm.cadastroFeriado = {};

        vm.id = $stateParams.id;


        vm.consultarFeriado = {
            offset: undefined,
            limit: undefined,
            periodoInicialFeriado: undefined,
            periodoFinalFeriado: undefined,
            ano: undefined
        };

        function init() {
            vm.editarFeriado = false;
            vm.editar();
            vm.isDetalhar = $stateParams.isDetalhar === 'true';
        }

        vm.salvarCadastroFeriado = function () {
            if (vm.cadastrarFeriadoForm.$valid) {
                var dataAtual = new Date();
                vm.cadastroFeriado.dataFeriado = new Date(vm.cadastroFeriado.dataFeriado);
                if (vm.cadastroFeriado.dataFeriado < dataAtual) {
                    MensagensService.exibirMensagemErro("A data informada não é válida.");
                    return;
                }

                if (vm.editarFeriado == false) {
                    FeriadoService.salvarFeriado(vm.cadastroFeriado).then(
                        function (response) {
                            vm.salvar = response.data.resultado;
                            MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                            vm.cadastrarFeriadoForm.$setSubmitted();
                            vm.voltarConsultaFeriado();
                        },
                        function (errorResponse) {
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
                                        .textContent("A data informada já possui cadastro.")
                                        .hideDelay(3000)
                                );
                                $log.log(errorResponse);
                            }

                        }
                    );
                }

                if (vm.editarFeriado == true) {
                    FeriadoService.editarFeriadoSdsic(vm.cadastroFeriado).then(
                        function (response) {
                            vm.salvar = response.data.resultado;
                            MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                            vm.cadastrarFeriadoForm.$setSubmitted();
                            vm.voltarConsultaFeriado();
                        },
                        function (errorResponse) {
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
                                        .textContent("A data informada já possui cadastro.")
                                        .hideDelay(3000)
                                );
                                $log.log(errorResponse);
                            }

                        }
                    );
                }


            } else {
                MensagensService.exibirMensagemCamposObrigatorios();

            }
        };

        vm.editar = function () {
            if (vm.id != null) {
                vm.editarFeriado = true;
                FeriadoService.editarFeriado(vm.id).then(
                    function (response) {
                        vm.cadastroFeriado = response.data;
                        vm.cadastroFeriado.dataFeriado = new Date(vm.cadastroFeriado.dataFeriado);
                    }
                )
            }
        };


        vm.voltarConsultaFeriado = function () {
            $state.go("consultarFeriado")
        };

        init();
    }

})();
