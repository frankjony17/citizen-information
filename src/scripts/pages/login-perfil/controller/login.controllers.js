(function () {
    'use strict';
    angular.module('sdsicApp').controller("LoginController", ['usuarioService', controller]);
        function controller(usuarioService) {
            var me = this;

            me.perfisUsuario = {};
            me.perfilUsuario = "-";
            me.boolPerfil = true;

            usuarioService.getUsuarioLogadoPerfis().then(function(response) {
                me.perfisUsuario = response.data;
                if (me.perfisUsuario.perfis.length === 1) {
                    me.perfilUsuario = me.perfisUsuario.perfis[0];
                    me.entrar();
                }
                console.log(me.perfisUsuario); // Usuario logado;
            }, function (response) {
                console.log("Erro: 'LoginController->usuarioService.getUsuarioLogadoPerfis()'", response)
            });

            me.entrar = function () {
                var
                usuario = {
                    id: me.perfisUsuario.id,
                    cpf: me.perfisUsuario.cpf,
                    nome: me.perfisUsuario.nome,
                    email: me.perfisUsuario.email,
                    cargo: me.perfisUsuario.cargo,
                    funcao: me.perfisUsuario.funcao,
                    telefone: me.perfisUsuario.telefone,
                    assinatura: me.perfisUsuario.assinatura,
                    autoridadeMaxima: me.perfisUsuario.autoridadeMaxima,
                    autoridadeHierarquica: me.perfisUsuario.autoridadeHierarquica,
                    responsavelQuarta: me.perfisUsuario.responsavelQuarta,
                    responsavelTercera: me.perfisUsuario.responsavelTercera,
                    unidade: me.perfisUsuario.unidade
                },
                perfil = {
                    nome: me.perfilUsuario.nome,
                    isAtivo: me.perfilUsuario.isAtivo
                };
                usuarioService.savePerfilUsuario(usuario, perfil);
            };
        }
})();
