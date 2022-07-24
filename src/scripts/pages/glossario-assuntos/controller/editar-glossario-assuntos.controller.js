(function () {
    'use strict';
    angular.module('sdsicApp').controller('EditarGlossarioDeAssuntosController', ['GlossarioDeAssuntoService','$stateParams', '$mdDialog', '$state', '$mdToast', 'MensagensService', controller]);

    function controller(GlossarioDeAssuntoService, $stateParams, $mdDialog, $state, $mdToast, MensagensService ) {

        var vm = this;

        vm.temaSubtemaPalavraCahve = $stateParams;

        vm.voltar = _voltar;

        vm.editar = _editar;

        vm.newPalavraChave = function (chip) {
            return {descricao: chip};
        };

        vm.newSubtema = function (chip) {
            return {nomeSubtema: chip};
        };

        function getGlossarioDeTemaDTO() {
            return {
                "id": vm.temaSubtemaPalavraCahve.subtemaId,
                "nomeSubtema": vm.temaSubtemaPalavraCahve.nomeSubtema,
                "palavrasChaves": vm.temaSubtemaPalavraCahve.palavrasChaves,
                "tema": null
            }
        }

        function _editar() {
            if(vm.editarGlossarioTemasForm.$valid) {
                GlossarioDeAssuntoService.editarTema(getGlossarioDeTemaDTO()).then(
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
                            MensagensService.mensagemPalavraChaveDuplicado();
                        } else if (errorResponse.data.errorMessage.includes('SUBTEMA-EXIST-FOR-OTHER-TEMA')){
                            MensagensService.mensagemSubAssuntoDuplicado();
                        } else {
                            MensagensService.exibirMensagemErro(errorResponse.data.errorMessage);
                        }
                    }
                );
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.editarUnidadeForm.$setSubmitted();
            }
        }

        function _voltar () {
            $state.go("consultaGlossarioDeAssuntos");
        };
    }

})();
