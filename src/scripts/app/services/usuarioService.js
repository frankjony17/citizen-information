/**
 * Created by Basis Tecnologia on 24/08/2016.
 */
'use strict';
(function(){
    angular.module('sdsicApp').factory('usuarioService', ['$http', '$state', 'comumService', service]);
    function service($http, $state){
        var URL_FKSOLUTIONS = 'sdsic/api',
            urlUsuario = URL_FKSOLUTIONS+ '/cliente/usuario-logado',
            urlUsuarioPerfis = URL_FKSOLUTIONS+ '/usuario/logado';

        if (window.sessionStorage.getItem('session-security') === null) {
            sessionSecurity(false, null, null);
        }
        function sessionSecurity (bool, usuario, perfil) {
            window.sessionStorage.setItem("session-security", JSON.stringify({
                authorized: bool,
                perfil: perfil,
                usuario: usuario
            }));
        }
        function save (usuario, perfil) {
            return $http.put(URL_FKSOLUTIONS + "/unidade/usuario/editar/perfil", {
                cpf: usuario.cpf,
                nomePerfil: perfil.nome
            });
        }

        var
        getPerfilUsuarioLogado = function(){
            return $http.get(URL_FKSOLUTIONS + '/usuario/obter/perfil');
        },

        getUsuarioLogado = function(){
            return $http.get(urlUsuario);
        },

        getUsuarioLogadoPerfis = function () {
            return $http.get(urlUsuarioPerfis);
        },

        savePerfilUsuario = function (usuario, perfil) {
            if (perfil.isAtivo && usuario.unidade != null) {
                save(usuario, perfil).then(function() {
                    go(usuario, perfil, 'home');
                }, function (response) {
                    console.log("Erro: 'usuarioService->savePerfilUsuario(home)'", response)
                });
            }
            else if (perfil.nome === "FKSOLUTIONS.ADMIN") {
                // save(usuario, perfil).then(function() {
                    go(usuario, perfil, 'admin');
                // }, function (response) {
                    // console.log("Erro: 'usuarioService->savePerfilUsuario(FKSOLUTIONS.ADMIN)'", response)
                // });
            }
            else {
                sessionSecurity(false, usuario, perfil);
                $state.go('semUnidadeOuInativo');
            }
        },

        clear = function() {
            sessionSecurity(false, null, null)
        },

        go = function (usuario, perfil, url) {
            sessionSecurity(true, usuario, perfil);
            $state.go(url);
        }
        return {
            getUsuarioLogado: getUsuarioLogado,
            getUsuarioLogadoPerfis: getUsuarioLogadoPerfis,
            savePerfilUsuario: savePerfilUsuario,
            obterPerfil: getPerfilUsuarioLogado,
            clear: clear,
            go: go
        };
    }

}());
