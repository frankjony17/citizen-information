(function () {
    'use strict';
    angular.module('sdsicApp').controller('ConsultarClassificacaoRespostaController', ['ClassificacaoRespostaService', 'TipoClassificacaoRespostaService', '$mdDialog', '$mdToast', '$log','$state','MensagensService', controller]);

    function controller(ClassificacaoRespostaService, TipoClassificacaoRespostaService, $mdDialog, $mdToast, $log,$state,MensagensService) {
        var vm = this;

        vm.consultaClassificacaoResposta = {
            id: undefined,
            offset: undefined,
            limit: undefined,
            nomeTipoClassificacaoResposta: undefined,
            nomeClassificacao: undefined
        };

        vm.listaConsultaRespostaDTO = [];
        vm.totalConsulta = undefined;
        vm.totalPaginasConsulta = undefined;

        vm.excluir = excluir;
        vm.limpar = limpar;
        vm.consultar = consultar;
        vm.ativaInativaClassificacaoResposta = ativaInativaClassificacaoResposta;
        vm.irCadastrar = irCadastrar;
        vm.irEditar = irEditar;
        vm.gerarRelatorioExcel = _gerarRelatorioExcel;

        function init() {
            vm.buscarTipoClassificacaoResposta();
        }

        vm.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };

        function limpar() {
            vm.classificacoes = {};
            vm.consultaClassificacaoResposta = {};

        }

        function limparTabela() {
            vm.consultaClassificacaoResposta = {
                id: undefined,
                offset: undefined,
                limit: undefined,
                nomeTipoClassificacaoResposta: undefined,
                nomeClassificacao: undefined
            };
        }

        function consultar() {
            vm.consultaClassificacaoResposta.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.consultaClassificacaoResposta.limit = angular.copy(vm.tabelaConsulta.limit);
            ClassificacaoRespostaService.consultaClassificacaoResposta(vm.consultaClassificacaoResposta).then(
                function (successResponse) {
                    if(successResponse.data && successResponse.data.resultado && successResponse.data.resultado.length > 0) {
                        vm.classificacoes = successResponse.data.resultado;
                        vm.totalElementosConsulta = successResponse.data.totalElementos;
                        vm.totalPaginasConsulta = successResponse.data.totalPaginas;
                        vm.consultarFeriadoRealizada = angular.copy(vm.consultaClassificacaoResposta);

                        console.log(vm.classificacoes);
                        console.log(vm.totalElementosConsulta);
                        console.log(vm.totalPaginasConsulta);

                    } else {
                        limparTabela();
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Nenhum resultado encontrado.")
                                .hideDelay(3000)
                        );
                    }
                },
                function (errorResponse) {
                    limparTabela();
                    if(errorResponse.data && errorResponse.data.erros && errorResponse.data.erros.length > 0) {
                        for(var i = 0; i < errorResponse.data.erros.length; i++) {
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
                                .textContent("Ocorreu um erro não esperado ao realizar a consulta de classificação Resposta.")
                                .hideDelay(3000)
                        );
                        $log.log(errorResponse);
                    }
                }
            );
        }

        vm.buscarTipoClassificacaoResposta = function() {
            TipoClassificacaoRespostaService.buscarTipoClassificacaoResposta().then(
                function (response) {
                    vm.listaTipoClassificacaoResposta = response.data.resultado;
                }
            )
        };

        function ativaInativaClassificacaoResposta(claResp) {
            console.log(claResp);
            ClassificacaoRespostaService.ativarDesativarClassificacaoResposta(claResp.id, claResp.statusClassificacaoResposta).then(
                function () {
                    $mdToast.show(
                        $mdToast.simple().textContent("Dados enviados com sucesso.").hideDelay(3000)
                    );
                }
            );
        }

        function excluir(ev, id) {
            var confirm = $mdDialog.confirm()
                .title('Remover Classificação Resposta')
                .textContent('Deseja realmente excluir Classificação Resposta?')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');
            $mdDialog.show(confirm).then(function () {
                ClassificacaoRespostaService.deletarClassificacaoResposta(id).then(
                    function (response) {
                        consultar();
                        MensagensService.exibirMensagemSucesso("Classificação Resposta excluída com sucesso.");
                    }
                )

            })
        }

        function irCadastrar(){
            $state.go("cadastrarClassificacaoResposta") ;
        }

        function irEditar(id) {
            $state.go("editarClassificacaoResposta", {id : id})
        }

        function _gerarRelatorioExcel() {
            vm.consultaClassificacaoResposta.offset = angular.copy(vm.tabelaConsulta.page - 1);
            vm.consultaClassificacaoResposta.limit = angular.copy(vm.tabelaConsulta.limit);

            ClassificacaoRespostaService.gerarRelatorioExcel(vm.consultaClassificacaoResposta).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var nomeArquivo = 'ClassificacaoResposta.xls';
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = arquivoBase64;
                        link.download = nomeArquivo;

                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);

                        //simulate click
                        link.click();

                        //remove the link when done
                        document.body.removeChild(link);
                    } else {
                        window.open(arquivoBase64);
                    }
                },
                function (errorResponse) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao gerar o relatório excel.")
                            .hideDelay(3000)
                    );
                    $log.log(errorResponse);
                }
            );
        }

        init();
    }

})();
