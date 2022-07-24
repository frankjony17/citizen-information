(function () {
    'use strict';
    angular.module('sdsicApp').controller('TelaAdministrativaController', ['$state', '$scope', '$rootScope', 'TelaAdministrativaService', 'GlossarioDeAssuntoService','MensagensService', 'usuarioService', controller]);
    function controller($state, $scope, $rootScope, TelaAdministrativaService, GlossarioDeAssuntoService, MensagensService, usuarioService) {
        var scope = this;
        scope.protocolo = undefined;
        scope.TelaAdministrativaDTO = {
            statusSolicitacaoDTO: {
                nome: undefined
            },
            statusSolicitacaoRecursoDTO: {
                nome: undefined
            }
        };
        obterPerfil();
        scope.statusSolicitacao = undefined;
        scope.statusTramitacao = undefined;
        scope.alteracaoPedidoRecursoDTO = {
            idPedido : undefined,
            idStatusSolicitacao : undefined,
            justificativa: undefined,
            temaDTO: undefined
        };
        scope.NovostatusSolicitacao = [];

        init();

        scope.voltar = function () {
            $state.go("home");
        };

        scope.buscarPeloProtocolo = function () {
            TelaAdministrativaService.buscarPeloProtocoloService(scope.protocolo).then(
                function (sucess) {
                    scope.TelaAdministrativaDTO = sucess.data;
                    if (scope.TelaAdministrativaDTO.statusSolicitacaoDTO != null) {
                        scope.alteracaoPedidoRecursoDTO.idPedido = scope.TelaAdministrativaDTO.idPedido;
                        scope.alteracaoPedidoRecursoDTO.isPedido = true;
                        scope.isPedido = true;
                        scope.statusSolicitacao = scope.TelaAdministrativaDTO.statusSolicitacaoDTO.nome;
                        scope.statusTramitacao = scope.TelaAdministrativaDTO.statusTramitacaoDTO.nome;
                        TelaAdministrativaService.definirStatusPedido(scope.TelaAdministrativaDTO.statusSolicitacaoDTO.nome).then(
                            function (response) {
                                scope.NovostatusSolicitacao = response.data;
                            }
                        );
                    } else {
                        scope.alteracaoPedidoRecursoDTO.idPedido = scope.TelaAdministrativaDTO.idRecurso;
                        scope.alteracaoPedidoRecursoDTO.isPedido = false;
                        scope.statusSolicitacao = scope.TelaAdministrativaDTO.statusSolicitacaoRecursoDTO.nome;
                        scope.statusTramitacao = scope.TelaAdministrativaDTO.statusTramitacaoRecursoDTO.nome;
                        TelaAdministrativaService.definirStatusRecurso(scope.TelaAdministrativaDTO.statusSolicitacaoRecursoDTO.nome,scope.TelaAdministrativaDTO.statusSolicitacaoRecursoDTO.id).then(
                            function (sucess) {
                                scope.NovostatusSolicitacao = sucess.data;
                            }
                        )
                    }

                }
            );
        };

        scope.buscarPorSubtema = function () {
            GlossarioDeAssuntoService.buscarPorSubtema(scope.filtroPedidoDTO.idTema).then(
                function (sucessResponse) {
                    scope.subTemas = [];
                    scope.listaSubtemas = sucessResponse.data.resultado;
                    scope.idTema = scope.filtroPedidoDTO.idTema;
                }
            )
        };

        scope.alterarPedidoRecurso = function() {
            if($scope.formulario.$valid){
                if(scope.alteracaoPedidoRecursoDTO.justificativa != undefined){
                    if(scope.alteracaoPedidoRecursoDTO.justificativa.length < 30){
                        MensagensService.exibirMensagemErro("O campo justificativa deve ter no minimo 30 Caracteres");
                    }else{
                        TelaAdministrativaService.alterarPedidoRecurso(scope.alteracaoPedidoRecursoDTO).then(
                            function () {
                                limparCampos();
                                MensagensService.exibirMensagemSucesso("Dados Salvos com Sucesso");
                            }
                        )
                    }
                }else{
                    limparCampos();
                }

            }else{
                MensagensService.exibirMensagemErro("O campo justificativa e obrigatório");
            }
        };

        function init() {
            buscarTodosTemas();
        }

        function buscarTodosTemas() {
            GlossarioDeAssuntoService.buscarTodosTemas().then(
                function (sucessResponse) {
                    scope.listaTodosTemas = sucessResponse.data.resultado;
                }
            );
        }

        function limparCampos() {
            scope.protocolo = undefined;
            scope.TelaAdministrativaDTO.subtemas = undefined;
            scope.statusSolicitacao = undefined;
            scope.statusTramitacao = undefined;
            scope.usuarioLogadoDTO.nome = undefined;
            scope.alteracaoPedidoRecursoDTO.idStatusSolicitacao = undefined;
            scope.alteracaoPedidoRecursoDTO.justificativa = undefined;
            scope.TelaAdministrativaDTO.temaDTO = undefined;
            window.location.href  = 'http://sdsic.basis.com.br/#/';
        }

        function obterPerfil () {
            if (angular.isUndefined($rootScope.nomePerfil)) {
                usuarioService.obterPerfil().then(function(response) {
                    scope.nomePerfil = response.data;
                    obterUsuarioLogado();
                });
            } else {
                scope.nomePerfil = $rootScope.nomePerfil;
                obterUsuarioLogado();
            }
        }

        function obterUsuarioLogado () {
            if (angular.isUndefined($rootScope.usuarioLogadoV2)) {
                usuarioService.getUsuarioLogadoPerfis().then(function(response){
                    scope.usuarioLogado = response.data;
                    scope.usuarioLogadoDTO = { perfil: scope.nomePerfil, nome: scope.usuarioLogado.nome };
                });
            } else {
                scope.usuarioLogado = $rootScope.usuarioLogadoV2;
                scope.usuarioLogadoDTO = { perfil: scope.nomePerfil, nome: scope.usuarioLogado.nome };
            }
        }
    }

})();
