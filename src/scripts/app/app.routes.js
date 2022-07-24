(function () {
    'use strict';
    angular.module('sdsicApp').config(function ($stateProvider) {

        $stateProvider
            .state("logout", {
                url: "/logout",
                template: '',
                controller: 'LogoutController',
                authorization: false,
                ncyBreadcrumb: {
                    label: 'logout'
                }
            })

            .state("perfis", {
                url: "/perfis",
                templateUrl: 'scripts/pages/login-perfil/view/perfis.html',
                controller: 'LoginController as loginCtrl',
                authorization: false,
                ncyBreadcrumb: {
                    label: 'perfis'
                }
            })


            .state('semUnidadeOuInativo', {
                url: '/semUnidadeOuInativo',
                templateUrl: "scripts/pages/login-perfil/view/inativo-o-sem-unidade/inativo-o-sem-unidade.html",
                controller: 'InativoSemUnidadeController as inativoCtrl',
                authorization: false,
                ncyBreadcrumb: {
                    label: 'inativo'
                }
            })

            // ADMIN
            .state('admin', {
                url: '/admin',
                templateUrl: "scripts/pages/home/view/home.tmpl.html",
                controller: 'HomeController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'admin'
                }
            })

            // ALERTA USUARIO SEM UNIDADE
            .state('alertaUsuarioSemUnidade', {
                url: '/alertaUsuarioSemUnidade',
                templateUrl: "scripts/pages/login-perfil/view/admin/alerta-usuario-sem-unidade.html",
                controller: 'AdminController as adminCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ALERTA USUARIO SEM UNIDADE'
                }
            })

            // HOME
            .state('home', {
                url: '/',
                templateUrl: "scripts/pages/home/view/home.tmpl.html",
                controller: 'HomeController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'Home'
                }
            })

            // CONSULTA DE SOLICITAÇÃO DE INFORMAÇÃO (PEDIDO)
            .state('solicitacaoInformacao', {
                url: '/solicitacaoInformacao',
                templateUrl: "scripts/pages/solicitacao-informacao/view/solicitacao-informacao.consultar.tmpl.html",
                controller: 'ConsultaSolicitacaoInformacaoController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR SOLICITAÇÃO DE INFORMAÇÕES',
                    parent: 'home'
                }
            })

            //CADASTRAR FERIADO
            .state('cadastrarFeriado', {
                url: '/cadastrarFeriado',
                templateUrl: "scripts/pages/feriado/view/cadastrar-feriado.html",
                controller: 'CadastrarFeriadoController as cadastrarFeriadoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CADASTRAR FERIADO',
                    parent: 'home'
                }
            })

            //CONSULTAR FERIADO
            .state('consultarFeriado', {
                url: '/consultarFeriado',
                templateUrl: "scripts/pages/feriado/view/consultar-feriado.html",
                controller: 'ConsultarFeriadoController as consultarFeriadoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR FERIADO',
                    parent: 'home'
                }
            })
            //EDITAR FERIADO
            .state('editarFeriado', {
                url: '/editarFeriado/:id/:isDetalhar',
                templateUrl: "scripts/pages/feriado/view/cadastrar-feriado.html",
                controller: 'CadastrarFeriadoController as cadastrarFeriadoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'EDITAR FERIADO',
                    parent: 'home'
                }
            })

            // SOLICITAÇÃO DA INFORMAÇÃO DETALHADA
            .state('detalheSolicitacaoInformacao', {
                url: '/detalheSolicitacaoInformacao/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/solicitacao-informacao.detalhar.tmpl.html",
                controller: "DetalheSolicitacaoInformacaoController as scope",
                authorization: true,
                ncyBreadcrumb: {
                    label: 'DETALHAR SOLICITAÇÃO DE INFORMAÇÕES',
                    parent: 'solicitacaoInformacao'
                }
            })

            // DADOS DO SOLICITANTE
            .state('dadosSolicitante', {
                url: '/dadosSolicitante/:consulta/:instancia/:id',
                templateUrl: "scripts/pages/dados-solicitante/view/dados-solicitante.tmpl.html",
                controller: 'DadosSolicitacaoController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'DADOS SOLICITANTE',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // PROPOSTA DE RESPOSTA
            .state('propostaResposta', {
                url: '/propostaResposta/:idPedido',
                templateUrl: "scripts/pages/proposta-resposta/view/proposta-resposta.encaminhar.tmpl.html",
                controller: 'PropostaRespostaController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ENCAMINHAR PROPOSTA DE RESPOSTA',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // RESPOSTA ASSINADA
            .state('respostaAssinada', {
                url: '/respostaAssinada/:idPedido/:resposta',
                templateUrl: "scripts/pages/resposta-assinada/view/resposta-assinada.encaminhar.tmpl.html",
                controller: 'RespostaAssinadaController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ENCAMINHAR RESPOSTA ASSINADA',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // ENCAMINHAMENTO PARA E-OUV
            .state('encaminharEouv', {
                url: '/encaminharEouv/:idPedido',
                templateUrl: "scripts/pages/e-ouv/view/encaminhar-eouv.tmpl.html",
                controller: 'E-ouvController as eouvCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ENCAMINHAR E-OUV',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // PRORROGAÇÃO DE PRAZO
            .state('prorrogaPedidoInformacao', {
                url: '/prorrogaPedidoInformacao/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/solicitacao-informacao.prorrogar.tmpl.html",
                controller: 'ProrrogaPedidoController as prorrogarCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'PRORROGAR PRAZO',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })// PRORROGAÇÃO DE PRAZO E-sic
            .state('prorrogaPedidoInformacaoEsic', {
                url: '/prorrogaPedidoInformacaoEsic/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/solicitacao-informacao.prorrogar.tmpl.html",
                controller: 'ProrrogaPedidoController as prorrogarCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'PRORROGAR PRAZO',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })
            // REENCAMINHAR SOLICITAÇÃO
            .state('ReencaminharSolicitacao', {
                url: '/reencaminharSolicitacao/:fluxo/:idPedido',
                templateUrl: "scripts/pages/reencaminhar-solicitacao/view/reencaminhar-solicitacao.tmpl.html",
                controller: 'ReencaminharSolicitacaoController as reencaminharSolicitacaoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'REENCAMINHAR SOLICITACAO',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // DEVOLVER PEDIDO DE INFORMAÇÃO
            .state('devolverPedidoInformacao', {
                url: '/devolverPedidoInformacao/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/solicitacao-informacao.devolver.tmpl.html",
                controller: 'DevolverPedidoController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'DEVOLVER PEDIDO INFORMACAO',
                    parent: 'detalheSolicitacaoInformacao'
                }
            })

            // RESPONDER PEDIDO DE INFORMAÇÃO
            .state('responderPedidoInformacao', {
                url: '/responderPedidoInformacao/:fluxo/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/resposta-pedido.tmpl.html",
                controller: 'RespostaPedidoController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'RESPONDER PEDIDO INFORMACAO',
                    parent: 'respostaSolicitacaoInformacao'
                }
            })

            // RESPONDER PEDIDO DE INFORMAÇÃO PROPOSTA RESPOSTA
            .state('responderPedidoInformacaoPropostaResposta', {
                url: '/responderPedidoInformacaoPropostaResposta/:idPedido',
                templateUrl: "scripts/pages/resposta-assinada/view/resposta-pedido.tmpl.html",
                authorization: true,
                ncyBreadcrumb: {
                    label: 'RESPONDER PEDIDO INFORMACAO',
                    parent: 'respostaSolicitacaoInformacao'
                }
            })

            //EDITAR RESPOSTA
            .state('editarResposta', {
                url: '/editarResposta/:idPedido',
                templateUrl: "scripts/pages/solicitacao-informacao/view/resposta-pedido.tmpl.html",
                controller: 'RespostaPedidoController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'EDITAR RESPOSTA',
                    parent: 'home'
                }
            })

            //EDITAR PROPOSTA RESPOSTA
            .state('editarPropostaResposta', {
                url: 'editarPropostaResposta/:idPedido:editarResposta',
                templateUrl: "scripts/pages/resposta-assinada/view/resposta-pedido.tmpl.html",
                controller: 'RespostaAssinadaController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'EDITAR RESPOSTA',
                    parent: 'home'
                }
            })

            // CADASTRAR CLASSIFICAÇÃO RESPOSTA
            .state('cadastrarClassificacaoResposta', {
                url: '/cadastrarClassificacaoResposta',
                templateUrl: "scripts/pages/classificacao-resposta/view/cadastrar-classificacao-resposta.html",
                controller: 'CadastrarClassificacaoRespostaController as cadastrarClassificacaoRespostaCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CADASTRAR CLASSIFICACAO RESPOSTA',
                    parent: 'home'
                }
            })

            //CONSULTA CLASSIFICAÇÃO RESPOSTA
            .state('consultarClassificacaoResposta', {
                url: '/consultarClassificacaoResposta',
                templateUrl: "scripts/pages/classificacao-resposta/view/consultar-classificacao-resposta.html",
                controller: "ConsultarClassificacaoRespostaController as consultarClassificacaoRespostaCtrl",
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR CLASSIFICAÇÃO RESPOSTA',
                    parent: 'home'
                }

            })
            //EDITAR CLASSIFICAÇÃO RESPOSTA
            .state('editarClassificacaoResposta', {
                url: '/editarClassificacaoResposta/:id',
                templateUrl: "scripts/pages/classificacao-resposta/view/editar-classificacao-resposta.html",
                controller: 'CadastrarClassificacaoRespostaController as cadastrarClassificacaoRespostaCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'EDITAR CLASSIFICAÇÃO RESPOSTA',
                    parent: 'home'
                }
            })
             //CLASSIFICAR RESPOSTA
            .state('ClassificarResposta', {
                url: '/classificarResposta/:idPedido',
                templateUrl: "scripts/pages/classificacao-resposta/view/classificar-resposta.tmpl.html",
                controller: 'ClassificarRespostaController as classificarRespostaCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CLASSIFICAR RESPOSTA',
                    parent: 'home'
                }
            })
            //CLASSIFICAR RESPOSTA SIC
            .state('ClassificarRespostaSic', {
                url: '/classificarRespostaSic/:idPedido',
                templateUrl: "scripts/pages/classificar-resposta-sic/view/classificar-resposta-sic.html",
                controller: 'ClassificarRespostaSicController as classificarRespostaSicCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CLASSIFICAR RESPOSTA SIC',
                    parent: 'home'
                }
            })

            //GLOSSARIO DE ASSUNTOS
            .state('glossarioDeAssuntos', {
                url: '/cadastrarGlossarioDeAssuntos',
                templateUrl: "scripts/pages/glossario-assuntos/view/cadastrar-glossario-assuntos.tmpl.html",
                controller: 'GlossarioDeAssuntosController as glossarioDeAssuntosCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CADASTRAR GLOSSÁRIO DE ASSUNTOS',
                    parent: 'home'
                }
            })

            //CADASTRAR UNIDADES
            .state('cadastrarAtribuirUnidade', {
                url: '/cadastrarAtribuirUnidade',
                templateUrl: "scripts/pages/unidade/view/cadastrar-unidade.tmpl.html",
                controller: 'CadastrarUnidadeController as cadastrarUnidadeCtrl',
                authorization: true,
                params: {
                    "responsavelRecurso": null
                },
                ncyBreadcrumb: {
                    label: 'CADASTRAR UNIDADES',
                    parent: 'home'
                }
            })

            //CONSULTAR UNIDADES
            .state('consultarUnidade', {
                url: '/consultarUnidade',
                templateUrl: "scripts/pages/unidade/view/consultar-unidade.tmpl.html",
                controller: 'ConsultarUnidadeController as consultarUnidadeCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR UNIDADES',
                    parent: 'home'
                }
            })

            //EDITAR UNIDADES
            .state('editarAtribuirUnidade', {
                url: '/editarAtribuirUnidade',
                templateUrl: "scripts/pages/unidade/view/editar-unidade.tmpl.html",
                controller: 'EditarUnidadeController as editarUnidadeCtrl',
                authorization: true,
                params: {
                    "title": null,
                    "unidadePadrao": null
                },
                ncyBreadcrumb: {
                    label: 'EDITAR UNIDADES',
                    parent: 'home'
                }
            })

            //detalhar UNIDADES
            .state('detalharUnidade', {
                url: '/detalharUnidade',
                templateUrl: "scripts/pages/unidade/view/detalhar-unidade.tmpl.html",
                controller: 'DetalharUnidadeController as detalharUnidadeCtrl',
                authorization: true,
                params: {
                    "title": null,
                    "unidadePadrao": null
                },
                ncyBreadcrumb: {
                    label: 'DETALHAR UNIDADES',
                    parent: 'home'
                }
            })

            //ATRIBUIR UNIDADES
            .state('atribuirUnidade', {
                url: '/atribuirUnidade',
                templateUrl: "scripts/pages/unidade/view/atribuir-unidade.tmpl.html",
                controller: 'AtribuirUnidadeController as atribuirUnidadeCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ATRIBUIR UNIDADES',
                    parent: 'home'
                }
            })

            .state('consultaGlossarioDeAssuntos', {
                url: '/consultaGlossarioDeAssuntos',
                templateUrl: "scripts/pages/glossario-assuntos/view/consulta-glossario-assuntos.tmpl.html",
                controller: 'ConsultaGlossarioAssuntosController as consultaGlossarioAssuntosCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR GLOSSARIO DE ASSUNTOS',
                    parent: 'home'
                }
            })

            .state('consultarUsuario', {
                url: '/consultarUsuario',
                templateUrl: "scripts/pages/usuario/view/consultar-usuario.tmpl.html",
                controller: 'ConsultarUsuarioController as consultarUsuarioCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR USUARIO',
                    parent: 'home'
                }
            })

            .state('detalharUsuario', {
                url: '/detalharUsuario',
                templateUrl: "scripts/pages/usuario/view/detalhar-usuario.tmpl.html",
                controller: 'DetalharUsuarioController as detalharUsuarioCtrl',
                authorization: true,
                params: {
                    "cpf": null,
                    "nomePerfil":null
                },
                ncyBreadcrumb: {
                    label: 'DETALHAR USUARIO',
                    parent: 'home'
                }
            })

            .state('editarUsuario', {
                url: '/editarUsuario',
                templateUrl: "scripts/pages/usuario/view/editar-usuario.tmpl.html",
                controller: 'EditarUsuarioController as editarUsuarioCtrl',
                authorization: true,
                params: {
                    "cpf": null,
                    "nomePerfil": null
                },
                ncyBreadcrumb: {
                    label: 'EDITAR USUARIO',
                    parent: 'home'
                }
            })

            .state('dadosDoUsuario', {
                url: '/dadosDoUsuario',
                templateUrl: "scripts/pages/usuario/view/dados-usuario.tmpl.html",
                controller: 'DadosUsuarioController as dadosUsuarioCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'Dados USUARIO',
                    parent: 'home'
                }
            })

            .state('detalharGlossarioDeAssuntos', {
                url: '/detalharGlossarioDeAssuntos/',
                templateUrl: "scripts/pages/glossario-assuntos/view/detalhar-glossario-assuntos.tmpl.html",
                controller: 'DetalharGlossarioDeAssuntosController as detalharGlossarioDeAssuntosCtrl',
                authorization: true,
                params: {
                    "temaId": null,
                    "nomeTema": null,
                    "subtemaId": null,
                    "nomeSubtema": null,
                    "palavrasChaves": null
                },
                ncyBreadcrumb: {
                    label: 'DETALHAR GLOSSARIO DE ASSUNTOS',
                    parent: 'home'
                }
            })

            .state('editarGlossarioDeAssuntos', {
                url: '/editarGlossarioDeAssuntos/',
                templateUrl: "scripts/pages/glossario-assuntos/view/editar-glossario-assuntos.tmpl.html",
                controller: 'EditarGlossarioDeAssuntosController as editarGlossarioDeAssuntosCtrl',
                authorization: true,
                params: {
                    "nomeTema": null,
                    "subtemaId": null,
                    "nomeSubtema": null,
                    "palavrasChaves": null
                },
                ncyBreadcrumb: {
                    label: 'EDITAR GLOSSARIO DE ASSUNTOS',
                    parent: 'home'
                }
            })

            .state('consultarRecurso', {
                url: '/consultarRecurso',
                templateUrl: "scripts/pages/recurso/view/recurso-consultar.tmpl.html",
                controller: 'ConsultarRecursoController as consultarRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR RECURSO',
                    parent: 'home'
                }
            })

            .state('detalheRecurso', {
                url: '/detalheRecurso/:id',
                templateUrl: "scripts/pages/recurso/view/recurso-detalhar.tmpl.html",
                controller: 'DetalheRecursoController as detalheRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'DETALHE RECURSO',
                    parent: 'home'
                }
            })

            .state('devolverRecurso', {
                url: '/devolverRecurso/:id',
                templateUrl: "scripts/pages/recurso/view/recurso-devolver.tmpl.html",
                controller: 'DevolverRecursoController as devolverRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'DEVOLVER RECURSO',
                    parent: 'home'
                }
            })

            .state('enviarResposta', {
                url: '/enviarResposta/:id',
                templateUrl: "scripts/pages/recurso/view/recurso-enviar-resposta.tmpl.html",
                controller: 'RespostaRecursoController as respostaRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'RESPOSTA RECURSO',
                    parent: 'home'
                }
            })
            // PROPOSTA DE RESPOSTA RECURSO
            .state('propostaRespostaRecurso', {
                url: '/propostaRespostaRecurso/:idRecurso',
                templateUrl: "scripts/pages/proposta-resposta-recurso/view/proposta-resposta-recurso.tmpl.html",
                controller: 'PropostaRespostaRecursoController as propostaRespostaRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ENCAMINHAR PROPOSTA DE RESPOSTA RECURSO',
                    parent: 'home'
                }
            })

            // RESPOSTA ASSINADA RECURSO
            .state('respostaAssinadaRecurso', {
                url: '/respostaAssinadaRecurso/:id',
                templateUrl: "scripts/pages/resposta-assinada-recurso/view/resposta-recurso.tmpl.html",
                controller: 'RespostaAssinadaRecursoController as respostaAssinadaRecursoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'ENCAMINHAR RESPOSTA ASSINADA RECURSO',
                    parent: 'home'
                }
            })

            // RESPONDER PEDIDO DE INFORMAÇÃO PROPOSTA RESPOSTA
            .state('responderRecursoPropostaResposta', {
                url: '/responderRecursoPropostaResposta/:idRecurso',
                templateUrl: "scripts/pages/proposta-resposta-recurso/view/resposta-recurso.tmpl.html",
                authorization: true,
                ncyBreadcrumb: {
                    label: 'RESPONDER RECURSO',
                    parent: 'home'
                }
            })
            // TELA ADMINISTRATIVA
            .state('telaAdministrativa', {
                url: '/TelaAdministrativa',
                templateUrl: "scripts/pages/tela-administrativa/view/tela-administrativa.tmpl.html",
                controller: 'TelaAdministrativaController as scope',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'TELA ADMINISTRATIVA',
                    parent: 'home'
                }
            })

            // PEDIDO DUPLICADO
            .state('pedidoDuplicado', {
                url: '/pedidoDuplicado/:idPedido',
                templateUrl: "scripts/pages/pedido-duplicado/view/pedido-duplicado.tmpl.html",
                controller: 'PedidoDuplicadoController as pedidoDuplicadoCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'PEDIDO DUPLICADO',
                    parent: 'home'
                }
            })

            // CONSULTAR EMAIL
            .state('emailAlerta', {
                url: '/emailAlerta',
                templateUrl: "scripts/pages/email/view/consultar-email.tmpl.html",
                controller: 'ConsultarEmailController as consultarEmailCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'CONSULTAR EMAIL',
                    parent: 'home'
                }
            })
            // CADASTRAR EDI EMAIL
            .state('formularioEmailAlerta', {
                url: '/emailAlerta/:acao/:id',
                templateUrl: "scripts/pages/email/view/cadastrar-email.tmpl.html",
                controller: 'FormularioEmailController as formularioEmailCtrl',
                authorization: true,
                ncyBreadcrumb: {
                    label: 'EMAIL',
                    parent: 'home'
                }
            })
    });

})();
