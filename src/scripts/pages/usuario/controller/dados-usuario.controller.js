(function () {
    'use strict';
    angular.module('sdsicApp').controller('DadosUsuarioController' , ['$state',  '$stateParams', '$mdToast', '$mdDialog', 'UsuarioService', 'MensagensService', controller]);
    function controller($state, $stateParams,  $mdToast, $mdDialog, UsuarioService, MensagensService) {

        var me = this, sessionSecurity = JSON.parse(window.sessionStorage.getItem("session-security"));

        me.perfil = sessionSecurity.perfil.nome;
        me.usuario = {
            cpf: sessionSecurity.usuario.cpf,
            nome: sessionSecurity.usuario.nome,
            email: sessionSecurity.usuario.email != null ? sessionSecurity.usuario.email : null,
            telefone: sessionSecurity.usuario.telefone != null ? parseInt(sessionSecurity.usuario.telefone) : null,
            cargo: sessionSecurity.usuario.cargo,
            funcao: sessionSecurity.usuario.funcao,
            assinatura: sessionSecurity.usuario.assinatura,
            unidade: sessionSecurity.usuario.unidade != null ? sessionSecurity.usuario.unidade.nomeUnidade : "",
            subunidade: subunidade(),
            autoridadeHierarquica: sessionSecurity.usuario.autoridadeHierarquica,
            autoridadeMaxima: sessionSecurity.usuario.autoridadeMaxima,
            responsavelQuarta: sessionSecurity.usuario.responsavelQuarta,
            responsavelTercera: sessionSecurity.usuario.responsavelTercera
        };

        me.voltar = function () {
            $state.go("home");
        };

        me.isValid = function () {
            if (MensagensService.validityFields(me.dadosUsuarioForm)) {
                console.log(MensagensService.validityFields(me.dadosUsuarioForm));
                UsuarioService.editarDados({
                    id: sessionSecurity.usuario.id,
                    email: me.usuario.email,
                    telefone: me.usuario.telefone
                }).then(function(response) {
                    editarSession(response.data.email, response.data.telefone);
                    MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                    me.voltar();
                });
            }
        };

        function subunidade () {
            var subunidade = "";
            if (sessionSecurity.usuario.unidade != null && sessionSecurity.usuario.unidade.subunidade != null) {
                sessionSecurity.usuario.unidade.subunidade.forEach(function (sub) {
                    subunidade += sub.nomeUnidade +"("+ sub.siglaUnidade +"), ";
                });
            }
            return subunidade.substring(0, subunidade.length-2) + ".";
        }

        function editarSession (email, telefone) {
            sessionSecurity.usuario.email = email;
            sessionSecurity.usuario.telefone = telefone;
            window.sessionStorage.setItem("session-security", JSON.stringify({
                authorized: sessionSecurity.authorized,
                perfil: sessionSecurity.perfil,
                usuario: sessionSecurity.usuario
            }));
        }
    }
})();
