(function () {
    'use strict';
    angular.module('sdsicApp').controller('CadastrarClassificacaoRespostaController', ['ClassificacaoRespostaService', 'TipoClassificacaoRespostaService', '$mdDialog', '$mdToast', '$state', '$stateParams', 'MensagensService', controller]);

    function controller(ClassificacaoRespostaService, TipoClassificacaoRespostaService, $mdDialog, $mdToast, $state,$stateParams, MensagensService) {
        var vm = this;
        vm.cadastroClassificacaoResposta = {};
        vm.listaTipoClassificacaoResposta = [];
        vm.classificacao = {};
        vm.classificacoes = [];
        vm.editarClassificacaoResposta = {};
        vm.id = $stateParams.id;

        vm.incluir = incluir;
        vm.excluir = excluir;
        vm.salvar = _salvar;
        vm.editar = _editar;
        vm.voltarConsultarClassificacao = voltarConsultarClassificacao;

        function init() {
            vm.editarClassificacaoResposta = false;
            vm.buscarTipoClassificacaoResposta();
        }

        function _salvar() {
            console.log(vm.classificacoes)
            if(vm.classificacoes.length > 0) {
                ClassificacaoRespostaService.salvarClassificacaoResposta(vm.classificacoes).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        $state.go("consultarClassificacaoResposta");
                    },
                    function (errorResponse) {
                        if (errorResponse.data.errorMessage.includes('CLASSIFICACAO_RESPOSTA_UNIQUE')){
                            MensagensService.mensagemClassificacaoDuplicado();
                        } else {
                            MensagensService.exibirMensagemErro(errorResponse.data.errorMessage);
                        }
                    }
                );
            } else {
                MensagensService.exibirMensagemCamposObrigatorios2();
            }
        }

        function _editar() {
            if(vm.editarGlossarioTemasForm.$valid) {
                ClassificacaoRespostaService.editarClassificacaoResposta(vm.classificacao).then(
                    function () {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Dados enviados com sucesso.")
                                .hideDelay(3000)
                        );
                        $state.go("consultarClassificacaoResposta");
                    },
                    function (errorResponse) {
                        if (errorResponse.data.errorMessage.includes('CLASSIFICACAO_RESPOSTA_UNIQUE')){
                            MensagensService.mensagemClassificacaoDuplicado();

                        } else {
                            MensagensService.exibirMensagemErro(errorResponse.data.errorMessage);
                        }
                    }
                );
            } else {
                MensagensService.exibirMensagemCamposObrigatorios();
            }
        }

        vm.buscar = function () {
            if(vm.id != null) {
                ClassificacaoRespostaService.buscarClassificacao(vm.id).then(
                    function (response) {
                        vm.classificacao = response.data;
                        vm.listaTipoClassificacaoResposta.forEach(function(tipo){
                           if(tipo.id == vm.classificacao.tipoClassificacaoResposta.id){
                               vm.classificacao.tipoClassificacaoResposta = tipo;
                           }
                        });
                    }
                )
            }
        };

        vm.buscarTipoClassificacaoResposta = function () {
            TipoClassificacaoRespostaService.buscarTipoClassificacaoResposta().then(
                function (response) {
                    vm.listaTipoClassificacaoResposta = response.data.resultado;
                    vm.buscar();
                }
            )
        };

        function limpar() {
            vm.classificacao = {};
            vm.classificacaoRespostaForm.$setUntouched();
            vm.classificacaoRespostaForm.$setPristine();
        }

        function incluir() {
            if(vm.classificacoes > 0 && vm.classificacao.tipoClassificacaoResposta != null || vm.classificacao.descricao){
                vm.classificacoes.push(angular.copy(vm.classificacao));
                limpar();
            }else {
                MensagensService.exibirMensagemCamposObrigatorios();
            }
        }

        function excluir(ev) {
            var confirm = $mdDialog.confirm()
                .title('Remover Classificação Resposta')
                .textContent('Deseja realmente excluir Classificação Resposta?')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');
            $mdDialog.show(confirm).then(function () {
                var indice;
                for (var i = 0; i < vm.classificacoes.length; i++) {
                    indice = i;
                    break;
                }
                vm.classificacoes.splice(indice, 1);
                MensagensService.exibirMensagemSucesso(" Classificação Resposta excluída com sucesso.");

            })

        };

        function voltarConsultarClassificacao (){
            $state.go("consultarClassificacaoResposta");
        }

        init();
    }

})();
