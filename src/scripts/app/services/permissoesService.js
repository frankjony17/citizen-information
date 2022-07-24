'use strict';
(function(){
    angular.module('sdsicApp').factory('permissoesService', ['$rootScope', service]);
    function service ($rootScope) {
        var acesso = {}, permissoes = {};
        acesso.base = {ac:false,e_ouv:false,voltar:false,enviar:false,cancelar:false,cancelar_minuta:false,ver_dados:false,devolver:false,prorrogar:false,responder:false,prorrogado:false,encaminhar:false,validar_e_ouv:false,upload_button:false,classificar_r:false,pedidos_solicitante:false,cancelar_e_ouv:false,prorrogar_e_sic:false,finalizar_e_ouv:false,prorrogado_e_sic:false,entregar_resposta:false,classificar_r_e_sic:false,enviar_para_revisao:false,editar_cla_resposta:false,editar_resposta_sic:false,encaminhar_para_envio:false,editar_cla_resposta_sic:false,reencaminhar_para_orgao:false,validar_reen_para_orgao:false,assunto_subassunto_s:false,assunto_subassunto_e:false,assunto_subassunto_c:false,r_editar_resposta_sic:false};
        // Triagem SIC.
        permissoes.triagem_sic = init (
            regraPermissaoUm(false), semPermissao(false), semPermissao(false), semPermissao(false),
            semPermissao(false), semPermissao(false), semPermissao(false), semPermissao(false), detalhamento()
        );
        // Distribuição PF.
        permissoes.distribuicao_pf = permissoes.distribuicao_pf = init(
            semPermissao(['prorrogar_e_sic', 'ver_dados', 'voltar', 'assunto_subassunto_s', 'assunto_subassunto_e', 'assunto_subassunto_c']),
            regraPermissaoUm(['devolver']), semPermissao(false),
            semPermissao(false), semPermissao(false), detalhamento(), semPermissao(false), semPermissao(false), semPermissao(false)
        );
        // Produção de Resposta.
        permissoes.producao_resposta = init (
            semPermissao(['prorrogar_e_sic', 'ver_dados', 'voltar', 'assunto_subassunto_s', 'assunto_subassunto_e', 'assunto_subassunto_c']),
            semPermissao(['voltar']), semPermissao(false), regraPermissaoUm(false),
            semPermissao(['voltar']), detalhamento(), semPermissao(false), semPermissao(false), semPermissao(false)
        );
        // Edição Técnico.
        permissoes.edicao_tecnico = init (
            semPermissao(['prorrogar_e_sic', 'ver_dados', 'voltar', 'assunto_subassunto_s', 'assunto_subassunto_e', 'assunto_subassunto_c']),
            detalhamento(), semPermissao(false), detalhamento(),
            regraPermissaoUm(['devolver', 'minuta_resposta', 'responder', 'encaminhar', 'reencaminhar_para_orgao', 'prorrogar_e_sic', 'editar_minuta_resposta', 'cancelar_minuta']),
            detalhamento(), detalhamento(), detalhamento(), detalhamento()
        );
        // Resposta Assinada.
        permissoes.resposta_assinada = init (
            semPermissao(['prorrogar_e_sic', 'ver_dados', 'voltar', 'assunto_subassunto_s', 'assunto_subassunto_e', 'assunto_subassunto_c']),
            regraPermissaoUm(['prorrogar_e_sic', 'editar_resposta', 'devolver', 'enviar', 'encaminhar', 'responder', 'reencaminhar_para_orgao', 'e_ouv']),
            semPermissao(false), detalhamento(), detalhamento(), detalhamento(), detalhamento(), detalhamento(), detalhamento()
        );
        // Resposta SIC.
        permissoes.resposta_sic = init (
            regraPermissaoUm(['responder', 'devolver', 'encaminhar', 'reencaminhar_para_orgao', 'classificar_r', 'r_editar_resposta_sic', 'enviar_para_revisao']),
            detalhamento(), semPermissao(false), semPermissao(false), detalhamento(), detalhamento(), detalhamento(), detalhamento(), detalhamento()
        );
        // Revisão.
        permissoes.revisao = init (
            {}, semPermissao(false), semPermissao(false), semPermissao(false),
            detalhamento(), detalhamento(), detalhamento(), detalhamento(), detalhamento()
        );
        // Para Envio.
        permissoes.para_envio = init (
            semPermissao(['entregar_resposta', 'devolver', 'voltar', 'ver_dados', 'pedidos_solicitante', 'assunto_subassunto_s', 'assunto_subassunto_e', 'assunto_subassunto_c']), regraPermissaoUm(false), semPermissao(false),
            semPermissao(false), detalhamento(), detalhamento(), detalhamento(), detalhamento(), detalhamento()
        );
        // Sugestão de Reencaminhamento
        permissoes.sugestao_reencaminhamento = permissoes.triagem_sic;

        function temPermissao (element, pedido) {
            var estaAutorizado = false;
            if (pedido.nomeStatusSolicitacao === "Revisão" && ($rootScope.nomePerfil === "FKSOLUTIONS.ADMIN" || $rootScope.nomePerfil === "FKSOLUTIONS.ATENDENTE.SIC")) {
                permissoes[key(pedido.nomeStatusSolicitacao)][$rootScope.nomePerfil] = regraPermissaoRevisao(pedido.possuiEOuv);
            }
            if (angular.isDefined(pedido.nomeStatusSolicitacao) && permissoes.hasOwnProperty(key(pedido.nomeStatusSolicitacao))) {
                var acesso = permissoes[key(pedido.nomeStatusSolicitacao)][$rootScope.nomePerfil];
                if (acesso.hasOwnProperty(element)) {
                    estaAutorizado = acesso[element];
                }
            }
            return validate(estaAutorizado, pedido, element);
        }

        function validate(estaAutorizado, pedido, element) {
            return rev1(estaAutorizado, pedido, element);
        }

        function key(status) {
            var key = status;
            switch (status) {
                case 'Triagem SIC':
                    key = 'triagem_sic';
                    break;
                case 'Distribuição PF':
                    key = 'distribuicao_pf';
                    break;
                case 'Produção de Resposta':
                    key = 'producao_resposta';
                    break;
                case 'Edição Técnico':
                    key = 'edicao_tecnico';
                    break;
                case 'Resposta Assinada':
                    key = 'resposta_assinada';
                    break;
                case 'Resposta SIC':
                    key = 'resposta_sic';
                    break;
                case 'Revisão':
                    key = 'revisao';
                    break;
                case 'Para Envio':
                    key = 'para_envio';
                    break;
                case 'Sugestão de Reencaminhamento':
                    key = 'sugestao_reencaminhamento';
                    break;
                default:
                    break;
            }
            return key;
        }

        function detalhamento () {
            var ac = semPermissao(false);
            ac.ac = true;
            ac.voltar = true;
            ac.ver_dados = true;
            return ac;
        }

        function regraPermissaoUm (keys) {
            var ac = detalhamento();
            ac.e_ouv=true;
            ac.enviar=false;
            ac.cancelar=false;
            ac.prorrogar=true;
            ac.responder=true;
            ac.encaminhar=true;
            ac.upload_button=true;
            ac.prorrogar_e_sic=false;
            ac.pedidos_solicitante=true;
            ac.assunto_subassunto_s=true;
            ac.assunto_subassunto_e=true;
            ac.assunto_subassunto_c=true;
            ac.reencaminhar_para_orgao=true;
            ac.editar_resposta_sic=false;
            return incluir(ac, keys);
        }

        function regraPermissaoRevisao (eouv) {
            var ac = detalhamento();
            ac.devolver=true;
            if (eouv) {
                ac.finalizar_e_ouv=true;
            } else {
                ac.classificar_r_e_sic=true;
                ac.r_editar_resposta_sic=true;
                ac.encaminhar_para_envio=true;
                ac.prorrogar=true;
                ac.prorrogar_e_sic=false;
                ac.upload_button=true;
                ac.pedidos_solicitante=true;
                ac.assunto_subassunto_s=true;
                ac.assunto_subassunto_e=true;
                ac.assunto_subassunto_c=true;
            }
            return ac;
        }

        function init (admin_atendente, ponto, pontoam, respondente, tecnico, obsunidade, authier, autmax, obsgeral) {
            return {
                'FKSOLUTIONS.ADMIN': admin_atendente,
                'FKSOLUTIONS.ATENDENTE.SIC': admin_atendente,
                'FKSOLUTIONS.PONTO.FOCAL': ponto,
                'FKSOLUTIONS.PONTO.FOCAL.AUTORIDADE.MAXIMA': pontoam,
                'FKSOLUTIONS.RESPONDENTE': respondente,
                'FKSOLUTIONS.TECNICO': tecnico,
                'FKSOLUTIONS.OBSERVADOR.UNIDADE': obsunidade,
                'FKSOLUTIONS.AUTORIDADE.HIERARQUICA': authier,
                'FKSOLUTIONS.AUTORIDADE.MAXIMA': autmax,
                'FKSOLUTIONS.OBSERVADOR.GERAL': obsgeral
            };
        }

        function semPermissao (keys) {
            return incluir(angular.copy(acesso.base), keys);
        }

        function incluir(acesso, keys) {
            if (keys !== false) {
                keys.forEach(function (value) {
                    acesso[value]=!acesso[value];
                })
            }
            return acesso;
        }

        function rev1(estaAutorizado, pedido, element) {
            var bool = estaAutorizado;
            if (pedido.nomeStatusSolicitacao === "Distribuição PF" && ($rootScope.nomePerfil==="FKSOLUTIONS.PONTO.FOCAL")) {
                bool = temResposta(estaAutorizado, pedido, element);
            }
            if (pedido.nomeStatusSolicitacao === "Distribuição PF" && ($rootScope.nomePerfil==="FKSOLUTIONS.ATENDENTE.SIC" || $rootScope.nomePerfil==="FKSOLUTIONS.ADMIN")) {
                bool = prorrogarESic(estaAutorizado, pedido, element);
            }
            if (pedido.nomeStatusSolicitacao === "Produção de Resposta" && ($rootScope.nomePerfil==="FKSOLUTIONS.RESPONDENTE")) {
                bool = temResposta(estaAutorizado, pedido, element);
            }
            if (pedido.nomeStatusSolicitacao === "Edição Técnico" && ($rootScope.nomePerfil==="FKSOLUTIONS.TECNICO")) {
                bool = temResposta(estaAutorizado, pedido, element);
            }
            if (pedido.nomeStatusSolicitacao === "Triagem SIC" && ($rootScope.nomePerfil==="FKSOLUTIONS.ADMIN" || $rootScope.nomePerfil==="FKSOLUTIONS.ATENDENTE.SIC")) {
                bool = prorrogarESic(estaAutorizado, pedido, element);
                bool = temResposta(bool, pedido, element);
            }
            return bool;
        }

        function temResposta(estaAutorizado, pedido, element) {
            var bool = estaAutorizado;
            if (pedido.possuiRespostaPerfil) {
                bool = element === "editar_resposta_sic" || element === "enviar" || element === "cancelar" || element === "voltar" || element === "pedidos_solicitante" ||
                    element === "ver_dados" || element === "assunto_subassunto_s" || element === "assunto_subassunto_e" || element === "assunto_subassunto_c";
            }
            return bool;
        }

        function prorrogarESic(estaAutorizado, pedido, element) {
            var bool = estaAutorizado;
            if (element==="prorrogar_e_sic"){
                bool=pedido.prorrogado===true || pedido.diasUteisMaior10===true;
            }
                return bool;
            }
        return {
            temPermissao: temPermissao
        };
    }
}());
