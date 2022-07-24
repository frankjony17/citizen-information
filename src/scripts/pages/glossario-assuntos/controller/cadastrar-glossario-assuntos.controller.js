(function () {
    'use strict';
    angular.module('sdsicApp').controller('GlossarioDeAssuntosController', ['GlossarioDeAssuntoService','$stateParams', '$mdDialog', '$mdToast', '$state', 'MensagensService', controller]);
    function controller(GlossarioDeAssuntoService, $stateParams, $mdDialog, $mdToast, $state,  MensagensService ) {
        const vm = this;

        vm.subtema = {};
        vm.temaSubtemaTemp = [];
        vm.subtema.palavrasChaves = [];

        vm.voltar = _voltar;
        vm.salvar = _salvar;
        vm.incluir = _incluir;
        vm.buscarGlossarioDeTemas = buscarGlossarioDeTemas;

        vm.newSubtema = function (chip) {
            return {nomeSubtema: chip};
        };

        vm.newPalavraChave = function (chip) {
            return {descricao: chip};
        };

        function limparSubtema() {
            vm.subtema.nomeSubtema = "";
        }

        function limparPalavrasChaves() {
            vm.subtema.palavrasChaves = [];
        }

        function _incluir () {
            if (vm.subtema.nomeTema != null && vm.subtema.nomeSubtema) {
                if (vm.temaSubtemaTemp.length == 0) {
                    vm.temaSubtemaTemp.push({
                        "nomeTema": vm.subtema.nomeTema,
                        "subtemas": [{
                            "idSubtemaDTO": null,
                            "nomeSubtema": vm.subtema.nomeSubtema,
                            "palavrasChaves": vm.subtema.palavrasChaves,
                            "nomeTema": null
                        }]
                    });
                    limparSubtema();
                    limparPalavrasChaves();
                } else {
                    var tem_exist = false, sub_exist = true;
                    angular.forEach(vm.temaSubtemaTemp, function (value, key) {
                        if (value.nomeTema == vm.subtema.nomeTema)
                        {
                            angular.forEach(value.subtemas, function (sub, k) {
                                if (sub.nomeSubtema == vm.subtema.nomeSubtema) {
                                    vm.temaSubtemaTemp[key]["subtemas"][k]["palavrasChaves"].push.apply(vm.temaSubtemaTemp[key]["subtemas"][k]["palavrasChaves"], vm.subtema.palavrasChaves);
                                    limparSubtema();
                                    limparPalavrasChaves();
                                    sub_exist = false;
                                    return false;
                                }
                            });
                            if (sub_exist) {
                                vm.temaSubtemaTemp[key]["subtemas"].push({
                                    "idSubtemaDTO": null,
                                    "nomeSubtema": vm.subtema.nomeSubtema,
                                    "palavrasChaves": vm.subtema.palavrasChaves,
                                    "nomeTema": null
                                });
                                limparSubtema();
                                limparPalavrasChaves();
                            }
                            tem_exist = true;
                        }
                    });
                    if (!tem_exist) {
                        vm.temaSubtemaTemp.push({
                            "nomeTema": vm.subtema.nomeTema,
                            "subtemas": [{
                                "idSubtemaDTO": null,
                                "nomeSubtema": vm.subtema.nomeSubtema,
                                "palavrasChaves": vm.subtema.palavrasChaves,
                                "nomeTema": null
                            }]
                        });
                        limparSubtema();
                        limparPalavrasChaves();
                    }
                }
            } else {
                $mdToast.show(
                    $mdToast.simple().textContent("Não é possível incluir dados nulos.").hideDelay(3000)
                );
            }
        }

        function _salvar() {
            if(vm.temaSubtemaTemp.length > 0) {
                GlossarioDeAssuntoService.salvarGlossario(vm.temaSubtemaTemp).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        $state.go("consultaGlossarioDeAssuntos");
                    },
                    function (errorResponse) {
                        if (errorResponse.data.errorMessage.includes("ds_palavra_chave_unique")){
                            limparPalavrasChaves();
                            MensagensService.mensagemPalavraChaveDuplicado();
                        } else if (errorResponse.data.errorMessage.includes('SUBTEMA-EXIST-FOR-OTHER-TEMA')){
                            limparSubtema();
                            MensagensService.mensagemSubAssuntoDuplicado();
                        } else {
                            MensagensService.exibirMensagemErro(errorResponse.data.errorMessage);
                        }
                    }
                );
            } else {
                MensagensService.exibirMensagemCamposObrigatorios2();
            }
        }

        vm.confirmarFecharRespostaSemSalvar = function(ev) {
            if (vm.temaSubtemaTemp.length == 0) {
                $state.go("consultaGlossarioDeAssuntos");
            } else {
                $mdDialog.show({
                    templateUrl: 'scripts/pages/glossario-assuntos/view/cancelar-cadastro-glossario-assuntos-dialog.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: vm.customFullscreen,
                    locals: {
                    },
                    controller:['$scope', function ($scope) {
                        $scope.voltar = function () {
                            $state.go("consultaGlossarioDeAssuntos");
                            $mdDialog.cancel();
                        };

                        $scope.cancelar = function () {
                            $mdDialog.cancel();
                        }

                    }]
                });
            }
        };

        vm.excluirPalavraChave = function($event, tema) {
            var confirm = $mdDialog.confirm({focusOnOpen: false})
                .title('Excluir')
                .textContent('Deseja remover este registro?')
                .targetEvent($event)
                .ok('Sim')
                .cancel('Não');

            $mdDialog.show(confirm).then(function () {
                var temp = [];
                angular.forEach(vm.temaSubtemaTemp, function (value, index) {
                    if (value != tema) {
                        temp.push(value);
                    }
                });
                vm.temaSubtemaTemp = temp;
            },function () {
                $mdDialog.cancel();
            });
        };

        function buscarGlossarioDeTemas() {
            GlossarioDeAssuntoService.buscarGlossarioDeTemas(vm.id).then(
                function (response) {
                    var glossarioDeTemas = response.data;
                    vm.subtema.tema.idTema = glossarioDeTemas.tema.idTema;
                }
            );
        }

        function _voltar () {
            $state.go("consultaGlossarioDeAssuntos");
        }
    }
})();

