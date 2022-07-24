(function () {
    'use strict';
    angular.module('sdsicApp').controller('ClassificarRespostaController' , ['$element', '$stateParams', '$state', 'ClassificacaoRespostaService', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', controller]);
    function controller($element, $stateParams, $state, ClassificacaoRespostaService, EscopoCompartilhadoPedidoDuplicadoService, MensagensService) {

        var vm = this;

        vm.consultaClassificacaoResposta = {};
        vm.listatodasClassificacoes = [];
        vm.searchTerm;
        vm.orientacao = [];
        vm.transparenciaAtiva = [];
        vm.transparenciaPassiva = [];
        vm.acessoNegado = [];
        vm.idPedido = $stateParams.idPedido;
        vm.respostaClassificadaDTO = {};
        vm.tituloPagina = undefined;
        vm.autocompleteDemoRequireMatch = true;
        vm.selectedItemOrientacaoSolicitante = null;
        vm.searchTextOrientacaoSolicitante = null;
        vm.selectedItemTransparenciaAtiva = null;
        vm.searchTextTransparenciaAtiva = null;
        vm.selectedItemTransparenciaPassiva = null;
        vm.searchTextTransparenciaPassiva = null;
        vm.selectedItemAcessoNegado = null;
        vm.searchTextAcessoNegado = null;

        vm.clearSearchTerm = _clearSearchTerm;

        function init() {
            buscarOrientacaoSolicitante();
            buscarTransparenciaAtiva();
            buscarTransparenciaPassiva();
            buscarAcessoNegado();
            defineTituloDaPagina();
        }

        function _clearSearchTerm () {
            vm.searchTerm = '';
        }

        function buscarOrientacaoSolicitante() {
            ClassificacaoRespostaService.buscarTodasOrientacaoSolicitante().then(
                function (response) {
                    vm.listaOrientacaoSolicitante = response.data.resultado;
                }
            )
        }

        function buscarTransparenciaAtiva() {
            ClassificacaoRespostaService.buscarTodasTransparenciaAtiva().then(
                function (response) {
                    vm.listaTransparenciaAtiva = response.data.resultado;
                }
            )
        }

        function buscarTransparenciaPassiva() {
            ClassificacaoRespostaService.buscarTodasTransparenciaPassiva().then(
                function (response) {
                    vm.listaTransparenciaPassiva = response.data.resultado;
                }
            )
        }

        function buscarAcessoNegado() {
            ClassificacaoRespostaService.buscarTodasAcessoNegado().then(
                function (response) {
                    vm.listaAcessoNegado = response.data.resultado;
                }
            )
        }

        function defineTituloDaPagina() {
            var possuiClassificacao;
            ClassificacaoRespostaService.verificaSePossuiClassificacaoResposta(vm.idPedido).then(function (response) {
                possuiClassificacao = response.data;
                if(possuiClassificacao) {
                    vm.tituloPagina = "Editar Classificação da Resposta SIC";
                    buscarClassificacaoResposta();
                } else {
                    vm.tituloPagina = "Classificar Resposta SIC";
                }
            });
        }

        function buscarClassificacaoResposta() {
            ClassificacaoRespostaService.buscarClassificacaoResposta(vm.idPedido).then(function (response) {
                var classificacaoResposta = response.data;
                console.log(classificacaoResposta);
                classificacaoResposta.forEach(function(classificacao) {
                    console.log(classificacao);
                    console.log(classificacao.tipoClassificacaoResposta);
                    switch(classificacao.tipoClassificacaoResposta.id) {
                        case 1:
                            vm.listaOrientacaoSolicitante.forEach(function(item){
                                if(item.id === classificacao.id){
                                    vm.orientacao.push(item);
                                }
                            });
                            break;
                        case 2:
                            vm.listaTransparenciaAtiva.forEach(function(item){
                                if(item.id === classificacao.id){
                                    vm.transparenciaAtiva.push(item);
                                }
                            });
                            break;
                        case 3:
                            vm.listaTransparenciaPassiva.forEach(function(item){
                                if(item.id === classificacao.id){
                                    vm.transparenciaPassiva.push(item);
                                }
                            });
                            break;
                        case 4:
                            vm.listaAcessoNegado.forEach(function(item){
                                if(item.id === classificacao.id){
                                    vm.acessoNegado.push(item);
                                }
                            });
                            break;
                    }
                    console.log(vm.orientacao);
                });
            });
        }

        vm.salvar = function(){
          var classificacaoResposta = vm.orientacao
                                      .concat(vm.transparenciaAtiva)
                                      .concat(vm.transparenciaPassiva)
                                      .concat(vm.acessoNegado);
          vm.respostaClassificadaDTO.listaClassificacaoResposta = classificacaoResposta;
          vm.respostaClassificadaDTO.id = vm.idPedido;
          if(vm.respostaClassificadaDTO.listaClassificacaoResposta.length > 0) {
            ClassificacaoRespostaService.salvarRespostaClassificada(vm.respostaClassificadaDTO).then(
                 function (response) {
                     MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                     vm.voltarDetalhar();
                 }
             );
          } else {
            MensagensService.exibirMensagemErro("É obrigatório informar a classificação da resposta.");
          }
        };

        vm.transformChip = function(chip) {
            if (angular.isObject(chip)) {
                return chip;
            }
            return { descricao: chip, type: 'new' };
        };

        vm.consultaOrientacaoSolicitante = function(query) {
            var results = query ? vm.listaOrientacaoSolicitante.filter(createFilterFor(query)) : [];
            return results;
        };

        vm.consultaTransparenciaAtiva = function(query) {
            var results = query ? vm.listaTransparenciaAtiva.filter(createFilterFor(query)) : [];
            return results;
        };

        vm.consultaTransparenciaPassiva = function(query) {
            var results = query ? vm.listaTransparenciaPassiva.filter(createFilterFor(query)) : [];
            return results;
        };

        vm.consultaAcessoNegado = function(query) {
            var results = query ? vm.listaAcessoNegado.filter(createFilterFor(query)) : [];
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = query.toLowerCase();

            return function filterFn(item) {
                return item.descricao.indexOf(lowercaseQuery) === 0 ||
                    item.descricao.toLowerCase().indexOf(lowercaseQuery) === 0;
            };
        }

        vm.voltarDetalhar = function() {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        };

        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        init();
    }
})();
