(function () {
    'use strict';
    angular.module('sdsicApp').controller('DetalharUsuarioController' , ['$state', '$stateParams', 'UsuarioService', controller]);
    function controller($state, $stateParams, UsuarioService) {
        var vm = this;
        vm.cpf = $stateParams.cpf;
        vm.nomePerfil = $stateParams.nomePerfil;
        vm.detalharUsuario = [];

        vm.editar = editarUsuario;

        vm.voltar = function () {
            $state.go("consultarUsuario");
        };
        init();

        function detalharUsuario () {
            UsuarioService.detalharUsuario(vm.cpf, vm.nomePerfil).then(function (response) {
                var temp = response.data;
                temp.orgao = [temp.orgao];
                temp.unidade = [temp.unidade];
                vm.detalharUsuario = temp;
                vm.defaultSubunidade = vm.detalharUsuario.subunidades;
            });
        }

        function editarUsuario () {
            $state.go("editarUsuario", {cpf: vm.cpf, nomePerfil: vm.nomePerfil});
        }

        function init() {
            detalharUsuario();
        }
    }
})();
