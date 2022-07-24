(function () {
    angular.module('sdsicApp').controller('ConsultaGlossarioAssuntosController', ['GlossarioDeAssuntoService', '$mdToast', '$log', '$state','MensagensService', controller]);

    function controller(GlossarioDeAssuntoService, $mdToast, $log, $state, MensagensService) {

        var vm = this;

        vm.consultaGlossarioDeTema = {
            id: undefined,
            offset: undefined,
            limit: undefined,
            idTema: undefined,
            idPalavraChave: undefined,
            nomeSubtema: undefined
        };
        vm.listaTodos = [];
        vm.listaTemas = [];
        vm.listaTemasSubtemas = [];

        vm.totalConsulta = undefined;
        vm.totalPaginasConsulta = undefined;

        vm.limpar = limpar;
        vm.consultar = consultar;
        vm.irCadastrar = irCadastrar;
        vm.editar = _editar;
        vm.detalharGlossarioTemas = _detalharGlossarioTemas;
        vm.gerarRelatorioExcel = _gerarRelatorioExcel;

        function init() {
            buscarTodosTemas();
        }

        vm.tabelaConsulta = {
            limit: 5,
            limitsPage: [5, 10, 15],
            page: 1,
            total: 0
        };

        function limpar() {
            vm.listaTemas = {};
            vm.consultaGlossarioDeTema = {};
        }

        function limparTabela() {
            vm.consultaSubtema = {
                id: undefined,
                offset: undefined,
                limit: undefined,
                idTema: undefined,
                idPalavraChave: undefined,
                nomeSubtema: undefined
            };

        }

        function buscarTodosTemas () {
            GlossarioDeAssuntoService.buscarTodosTemas().then(
                function (sucessResponse) {
                    vm.listaTodosTemas = sucessResponse.data.resultado;
                }
            )
        }

        vm.buscarPalavraChave = function (palavrasChaves) {
            vm.palavrasChaves = [];
            for (var i = 0; i < palavrasChaves.length; i++) {
                vm.palavrasChaves.push(palavrasChaves[i].descricao);
            }
        };

        vm.buscarPorSubtema = function () {
            GlossarioDeAssuntoService.buscarPorSubtema(vm.consultaGlossarioDeTema.tema.idTema).then(
                function (sucessResponse) {
                    vm.listaSubtemas = sucessResponse.data.resultado;
                    vm.palavrasChaves = [];
                }
            )

        };

        vm.buscarPorPalavraChave = function () {
            vm.palavrasChaves = vm.consultaGlossarioDeTema.nomeSubtema.palavrasChaves;
        };

        function consultar() {
            if(vm.glossarioDeTemasForm.$valid){
                GlossarioDeAssuntoService.consultaGlossarioDeTema(filtro()).then(
                    function (successResponse) {
                        if (successResponse.data && successResponse.data.resultado && successResponse.data.resultado.length > 0) {
                            vm.listaTemas = successResponse.data.resultado;
                            vm.totalElementosConsulta = successResponse.data.totalElementos;
                            vm.totalPaginasConsulta = successResponse.data.totalPaginas;
                            vm.consultarSubtemaRealizada = angular.copy(vm.consultaGlossarioDeTema);
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
                                    .textContent("Ocorreu um erro não esperado ao realizar a consulta de glossário de listaTemas .")
                                    .hideDelay(3000)
                            );
                            $log.log(errorResponse);
                        }
                    }
                );
            }else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.glossarioDeTemasForm.$setSubmitted();
            }

        }

        function _detalharGlossarioTemas(id, nomeTema, nomeSubtema, palavrasChaves) {
            $state.go("detalharGlossarioDeAssuntos", {
                "nomeTema": nomeTema,
                "subtemaId": id,
                "nomeSubtema": nomeSubtema,
                "palavrasChaves": palavrasChaves
            });
        }

        function irCadastrar() {
            $state.go("glossarioDeAssuntos");
        }

        function _editar(id, nomeTema, nomeSubtema, palavrasChaves) {
            $state.go("editarGlossarioDeAssuntos", {
                "nomeTema": nomeTema,
                "subtemaId": id,
                "nomeSubtema": nomeSubtema,
                "palavrasChaves": palavrasChaves
            });
        }

        function _gerarRelatorioExcel() {
            GlossarioDeAssuntoService.gerarRelatorioExcel(filtro()).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var nomeArquivo = 'ConsultaGlossarioAssuntos.xls';
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

        function filtro () {
            var filtro = {};
            filtro.offset = angular.copy(vm.tabelaConsulta.page - 1);
            filtro.limit = angular.copy(vm.tabelaConsulta.limit);
            if (vm.consultaGlossarioDeTema.tema && vm.consultaGlossarioDeTema.tema.idTema) {
                filtro.idTema = vm.consultaGlossarioDeTema.tema.idTema;
            }
            if (vm.consultaGlossarioDeTema.nomeSubtema && vm.consultaGlossarioDeTema.nomeSubtema.nomeSubtema) {
                filtro.nomeSubtema = vm.consultaGlossarioDeTema.nomeSubtema.nomeSubtema;
            }
            if (vm.consultaGlossarioDeTema.palavrasChaves && vm.consultaGlossarioDeTema.palavrasChaves.id) {
                filtro.idPalavraChave = vm.consultaGlossarioDeTema.palavrasChaves.id;
            }
            return filtro;
        }

        init();
    }
})();
