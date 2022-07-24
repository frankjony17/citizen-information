
'use strict';
angular.module('sdsicApp').directive('temaSubtema', ['GlossarioDeAssuntoService','SolicitacaoInformacaoService','MensagensService', 'permissoesService', function (GlossarioDeAssuntoService,SolicitacaoInformacaoService,MensagensService) {
    return{
        templateUrl: "scripts/pages/solicitacao-informacao/directive/view/temaSubtema.html",
        controller: function($scope,$stateParams,GlossarioDeAssuntoService,SolicitacaoInformacaoService,MensagensService,permissoesService){
            var vm = $scope;
            var pedidoTemaDTO = {};
            var subtemaDTO = [];
            var subtemaDTOobjeto = {
                idSubtemaDTO: undefined,
                nomeSubtema: undefined,
                nomeTema: undefined
            };
            vm.subtemas = [];
            vm.palavras = [];
            vm.subtema = {};
            vm.idPedido = $stateParams.idPedido;
            vm.isEditar = false;
            vm.listaTodosTemas = [];
            vm.tema = {};
            vm.buscarTodosTemas = buscarTodosTemas;
            vm.carregarPedidoDetalhado = carregarPedidoDetalhado;
            vm.buscarPorSubtema = buscarPorSubtema;
            vm.alterarIsEditar = alterarIsEditar;

            vm.temPermissaoTema = function (element) {
                if (vm.pedidoDetalhadoDTO) {
                    return permissoesService.temPermissao(element, vm.pedidoDetalhadoDTO);
                }
            };

            vm.$watch('consultaGlossarioDeTema.tema.idTema', function(){

            }, true);

            init();

            function init() {
                carregarPedidoDetalhado();
                buscarTodosTemasSubtemasPalavraChavePedido();
            }

            function buscarTodosTemas() {
                GlossarioDeAssuntoService.buscarTodosTemas().then(function (sucessResponse) {
                    vm.listaTodosTemas = sucessResponse.data.resultado;
                    if(vm.TemasSubtemasPalavraChavePedido.tema != null){
                        for(var a =0; a < vm.listaTodosTemas.length; a++){
                            if(vm.listaTodosTemas[a].id == vm.TemasSubtemasPalavraChavePedido.tema.id){
                                vm.tema = vm.listaTodosTemas[a].id;
                                buscarPorSubtema();
                            }
                        }
                    }
                });
            }

            function alterarIsEditar(acao) {
                if (acao == "editar") {
                    vm.isEditar = true;
                } else {
                    vm.isEditar = false;
                    buscarTodosTemasSubtemasPalavraChavePedido();
                }
            }

            function buscarTodosTemasSubtemasPalavraChavePedido() {
                SolicitacaoInformacaoService.buscarTodosTemasSubtemasPalavraChavePedido(vm.idPedido).then(function (response) {
                    vm.TemasSubtemasPalavraChavePedido = response.data;
                    buscarTodosTemas();
                });
            }

            function carregarPedidoDetalhado() {
                SolicitacaoInformacaoService.consultarPedidoDetalhado(vm.idPedido).then(function (successResponse) {
                    vm.pedidoDetalhadoDTO = successResponse.data;
                });
            }

            function buscarPorSubtema () {
                GlossarioDeAssuntoService.buscarPorSubtema(vm.tema).then(function (sucessResponse) {
                    vm.subtemas = [];
                    vm.palavras = [];
                    vm.listaSubtemas = sucessResponse.data.resultado;
                    console.log(vm.listaSubtemas);
                    vm.idTema = vm.tema;
                    for(var a = 0; a < vm.listaSubtemas.length; a++) {
                        if (vm.TemasSubtemasPalavraChavePedido.subtema != null) {
                            for(var b = 0; b < vm.TemasSubtemasPalavraChavePedido.subtema.length; b++) {
                                if(vm.listaSubtemas[a].id == vm.TemasSubtemasPalavraChavePedido.subtema[b].idSubtemaDTO){
                                    vm.subtemas.push(vm.listaSubtemas[a]);
                                }
                                for(var d = 0; d < vm.listaSubtemas[a].palavrasChaves.length; d++){
                                    for(var c = 0; c <  vm.TemasSubtemasPalavraChavePedido.palavraChaveList.length; c++){
                                        if(vm.listaSubtemas[a].palavrasChaves[d].id == vm.TemasSubtemasPalavraChavePedido.palavraChaveList[c].id){
                                            vm.palavras.push(vm.listaSubtemas[a].palavrasChaves[d]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

            vm.associar = function(idTemaPedido, idPedido, subtemas, palavrasChaves) {
               if(vm.formulario.$valid) {
                   pedidoTemaDTO.idTema = idTemaPedido;
                   pedidoTemaDTO.idPedido = idPedido;
                   pedidoTemaDTO.palavrasChaves = palavrasChaves;
                   for(var i = 0; i < subtemas.length ; i++) {
                       //MONTANDO OBJETO SUBTEMA PARA INSERIR EM ARRAY
                       subtemaDTOobjeto.idSubtemaDTO = subtemas[i].id;
                       subtemaDTOobjeto.nomeSubtema = subtemas[i].nomeSubtema;
                       subtemaDTOobjeto.nomeTema = subtemas[i].tema.nomeTema;
                       //INSERINDO OS
                       subtemaDTO.push(subtemaDTOobjeto);
                       subtemaDTOobjeto = {
                           idSubtemaDTO: undefined,
                           nomeSubtema: undefined,
                           nomeTema: undefined
                       };
                   }
                   pedidoTemaDTO.subtemaDTO = subtemaDTO;
                   subtemaDTO = [];
                   SolicitacaoInformacaoService.associarPedidoTema(pedidoTemaDTO).then(
                       function () {
                           MensagensService.exibirMensagemSucesso("Dados Salvos com Sucesso");
                           $scope.onsuccess();
                       }
                   );
                   vm.isEditar = false;
                   location.reload();
               }else{
                   MensagensService.exibirMensagemErro("Dados obrigatórios não preenchidos");
               }

            }

        },
        scope: {
            onsuccess: '='
        }
    }

}]);

