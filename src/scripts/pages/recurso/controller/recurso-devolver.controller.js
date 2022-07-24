(function () {

    'use strict';

    angular.module('sdsicApp').controller('DevolverRecursoController', ['$scope', '$window', '$document', '$log', '$state', '$mdToast', '$stateParams', 'SolicitacaoInformacaoService', 'DevolverRecursoService', 'MensagensService', 'PropostaRespostaRecursoService' , controller]);

    function controller($scope, $window, $document, $log, $state, $mdToast, $stateParams, SolicitacaoInformacaoService, DevolverRecursoService, MensagensService, PropostaRespostaRecursoService) {

        var vm = this;

        // Declaração de variaveis -------------------------------------------------------------------------------------

        vm.idRecurso = $stateParams.id;

        vm.devolverRecursoDTO = {};

        vm.instanciaRecurso = undefined;

        vm.nomeUsuario = undefined;

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        vm.devolver = _devolver;

        vm.voltar = _voltar;

        // Inicialização da controller----------------------------------------------------------------------------------

        init();

        // Implementação de metodos privados----------------------------------------------------------------------------

        function init() {
            consultarStatusRecurso();
            buscarInstancia();
            buscarUsuario();
           // buscarUltimoStatusSolicitacao();
        }

        function buscarUsuario() {
            PropostaRespostaRecursoService.buscarUsuario(vm.idRecurso).then(
                function (sucessResponse) {
                 vm.nomeUsuario = sucessResponse.data;
                }
            )

        }


        function buscarInstancia(){
            PropostaRespostaRecursoService.buscarInstanciaRecurso(vm.idRecurso).then(
                function (sucessResponse) {
                    vm.instanciaRecurso = sucessResponse.data;
                }
            )
        }


        function consultarStatusRecurso() {
            DevolverRecursoService.consultarStatusRecurso(vm.idRecurso).then(
                function (successResponse) {
                    vm.devolverRecursoDTO = successResponse.data;
                }
            );
        }

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        function _devolver() {
            if(vm.devolverRecursoForm.$valid) {
                vm.devolverRecursoDTO.idRecurso = vm.idRecurso;
                DevolverRecursoService.devolver(vm.devolverRecursoDTO).then(
                    function () {
                        MensagensService.exibirMensagemSucesso("O recurso foi devolvido com sucesso.");
                        $state.go("consultarRecurso");
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
                                    .textContent("Ocorreu um erro não esperado ao devolver o recurso.")
                                    .hideDelay(3000)
                            );
                        }
                    }
                );
            } else {
                if(vm.devolverRecursoForm.textJusticafiva.$error.minlength){
                    MensagensService.exibirmensagemQuantidadeCaracteres();
                }else{
                    MensagensService.exibirMensagemCamposObrigatorios();
                }
                vm.devolverRecursoForm.$setSubmitted();
            }

        }

        function _voltar() {
            $state.go("consultarRecurso");
        }

        // Implementação de metodos observadores------------------------------------------------------------------------
    }

})();
