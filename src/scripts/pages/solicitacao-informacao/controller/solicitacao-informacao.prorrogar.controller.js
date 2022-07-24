(function () {
    'use strict';
    angular.module('sdsicApp').controller('ProrrogaPedidoController', ['$state', '$rootScope', '$stateParams', controller]);
    function controller($state, $rootScope, $stateParams) {
        var vm = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        vm.consulta = "prorrogaPedido";
        vm.idPedido = $stateParams.idPedido;
        vm.isEsic = $state.current.name === 'prorrogaPedidoInformacaoEsic';
        vm.tituloPage = 'Prorrogar Pedido de Informação';
        $rootScope.tituloPagina = vm.tituloPage;

        function init() {
            if(vm.isEsic){
                vm.tituloPage = vm.tituloPage + ' e-SIC';
                $rootScope.tituloPagina = vm.tituloPage;
            }
        }
        init();
    }

})();
