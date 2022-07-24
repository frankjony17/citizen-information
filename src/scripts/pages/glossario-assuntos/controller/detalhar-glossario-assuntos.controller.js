(function () {
    'use strict';
    angular.module('sdsicApp').controller('DetalharGlossarioDeAssuntosController', ['GlossarioDeAssuntoService','$stateParams', '$mdDialog', '$state', 'MensagensService', controller]);

    function controller(GlossarioDeAssuntoService, $stateParams, $mdDialog, $state, MensagensService ) {

        var vm = this;

        vm.temaSubtemaPalavraCahve = $stateParams;

        vm.readonly = true;

        vm.editar = _editar;

        vm.voltar = _voltar;

        vm.newPalavraChave = function (chip) {
            return {descricao: chip};
        };

        vm.newSubtema = function (chip) {
            return {nomeSubtema: chip};
        };

        function _editar () {
            $state.go("editarGlossarioDeAssuntos", {
                "nomeTema": vm.temaSubtemaPalavraCahve.nomeTema,
                "subtemaId": vm.temaSubtemaPalavraCahve.subtemaId,
                "nomeSubtema": vm.temaSubtemaPalavraCahve.nomeSubtema,
                "palavrasChaves": vm.temaSubtemaPalavraCahve.palavrasChaves
            });
        }

        function _voltar () {
            $state.go("consultaGlossarioDeAssuntos");
        }
    }

})();
