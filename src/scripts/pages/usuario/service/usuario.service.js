(function () {

    'use strict';

    angular.module('sdsicApp').factory('UsuarioService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function atualizaPerfilUsuario(cpf, perfil){
            return $http.put(URL_FKSOLUTIONS + "/usuarioAcessos/update/perfil/"+ cpf, perfil);
        }

        function buscarTodosPerfis() {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/all-profiles");
        }

        function buscarTodosUsuarios() {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/all-users/");
        }

        function consultarUsuario(filtro) {
            return $http.get(URL_FKSOLUTIONS + '/usuarioAcessos', {
                params: {
                    filtro: filtro
                }
            });
        }

        function obterTodosUsuarios() {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/obterTodosUsuarios");
        }

        function salvar(dados) {
            return $http.post(URL_FKSOLUTIONS + "/usuarioAcessos/salvar", dados);
        }

        function detalharUsuario(cpf, nomePerfil) {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/detalhar", {
                params: { cpf: cpf, nomePerfil: nomePerfil }
            });
        }

        function gerarRelatorioExcel(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/usuarioAcessos/exportar', {
                params: {
                    filtro: fitro
                }
            });
        }

        function buscarUsuarioPontoFocalPorSubunidade(idSubunidade) {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/buscarUsuarioPontoFocalPorSubunidade/" + idSubunidade);
        }

        function buscarUsuarioTecnicoPorSubunidade() {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/buscarUsuarioTecnicoPorSubunidade");
        }

        function buscarUsuarioAutoridadeHierarquicaPorUnidade(idUnidade) {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/buscaUsuarioPorUnidade/" + idUnidade)

        }

        function buscarUsuarioAutoridadeMaximaPorUnidade(idUnidade) {
            return $http.get(URL_FKSOLUTIONS + "/usuarioAcessos/buscarUsuarioAutoridadeMaximaPorUnidade/" + idUnidade)
        }

        function editarDados(dados) {
            return $http.put(URL_FKSOLUTIONS + "/usuario/editar/dados", dados);
        }

        return {
            consultarUsuario: consultarUsuario,
            detalharUsuario: detalharUsuario,
            gerarRelatorioExcel: gerarRelatorioExcel,
            buscarTodosPerfis: buscarTodosPerfis,
            buscarTodosUsuarios: buscarTodosUsuarios,
            buscarUsuarioPontoFocalPorSubunidade: buscarUsuarioPontoFocalPorSubunidade,
            buscarUsuarioTecnicoPorSubunidade: buscarUsuarioTecnicoPorSubunidade,
            buscarUsuarioAutoridadeHierarquicaPorUnidade : buscarUsuarioAutoridadeHierarquicaPorUnidade,
            buscarUsuarioAutoridadeMaximaPorUnidade:buscarUsuarioAutoridadeMaximaPorUnidade,
            salvar: salvar,
            editarDados: editarDados,
            atualizaPerfilUsuario: atualizaPerfilUsuario,
            obterTodosUsuarios: obterTodosUsuarios
        };
    }
})();
