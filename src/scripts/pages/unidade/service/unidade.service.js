(function () {
    'use strict';
    angular.module('sdsicApp').factory('UnidadeService', service);

    function service($http) {
        var URL_FKSOLUTIONS = 'sdsic/api';

        function listarOrgaoDataBase() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/orgao");
        }

        function listaUnidadeDataBase(codigoOrgao) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/unidade/" + codigoOrgao);
        }

        function obterCadastro(codigoUnidade) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/obterCadastro/" + codigoUnidade);
        }

        function listarTudoDataBase() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/tudo");
        }

        function listarOrgaoSiorg() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/siorg/orgao");
        }

        function listarUnidadeSiorg(codigoOrgao) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/siorg/unidade/" + codigoOrgao);
        }

        function listarSubunidadeSiorg(codigoUnidade) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/siorg/subunidade/" + codigoUnidade);
        }

        // function listarSoSubunidadeSiorg(codigoUnidade) {
        //     return $http.get(URL_FKSOLUTIONS + "/unidade/subunidade/" + codigoUnidade);
        // }

        function listarUsuarioPorPerfil(nomePerfil) {
            return $http.post(URL_FKSOLUTIONS + "/unidade/acesso/usuarioPorPerfil", nomePerfil);
        }

        function buscaCargoFuncaoSiapPorUsuario(cpf) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/siap/buscaCargoFuncaoSiapPorUsuario/" + cpf);
        }

        function listarUsuarioSubstitutoPorPerfil(nomePerfil, id) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/acesso/usuarioSubstitutoPorPerfil/" + nomePerfil + "/" + id);
        }

        function ativarDesativarUnidade(id, estado) {
            return $http.put(URL_FKSOLUTIONS + "/unidade/estado/" + id + "/" + estado);
        }

        function salvar(dados) {
            return $http.post(URL_FKSOLUTIONS + "/unidade/salvar/tudo", dados);
        }

        function editar(dados) {
            return $http.put(URL_FKSOLUTIONS + "/unidade/editar/tudo", dados);
        }

        function obterResponsavelRecurso() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/responsavel");
        }

        function subunidadeEUnidade(codigoUnidade) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/e/subunidade/" + codigoUnidade);
        }

        function buscarListaUnidade() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/buscarListaUnidade");
        }

        function buscaUnidadePorNome(nome) {
            return $http.get(URL_FKSOLUTIONS + "/unidade/buscarUnidadePorNome", { params: { nome: nome } });
        }

        function buscarListaSubunidadePorUsuarioLogado() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/buscarListaSubunidadePorUsuarioLogado");
        }

        function buscarSubunidadeRespondente() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/buscarSubunidadeRespondente");
        }

        function gerarRelatorioExcel(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/unidade/exportar', {
                params: { fitro: fitro }
            });
        }

        function buscarUnidadeSic() {
            return $http.get(URL_FKSOLUTIONS + "/unidade/buscarUnidadeSic");
        }

        return {
            listarOrgaoSiorg: listarOrgaoSiorg,
            listarUnidadeSiorg: listarUnidadeSiorg,
            listarSubunidadeSiorg: listarSubunidadeSiorg,
            // listarSoSubunidadeSiorg: listarSoSubunidadeSiorg,
            listarUsuarioPorPerfil: listarUsuarioPorPerfil,
            listarUsuarioSubstitutoPorPerfil: listarUsuarioSubstitutoPorPerfil,
            salvar: salvar,
            editar: editar,
            ativarDesativarUnidade: ativarDesativarUnidade,
            obterResponsavelRecurso: obterResponsavelRecurso,
            subunidadeEUnidade: subunidadeEUnidade,
            listarOrgaoDataBase: listarOrgaoDataBase,
            listaUnidadeDataBase: listaUnidadeDataBase,
            listarTudoDataBase: listarTudoDataBase,
            obterCadastro: obterCadastro,
            buscarListaUnidade: buscarListaUnidade,
            buscaUnidadePorNome: buscaUnidadePorNome,
            buscarListaSubunidadePorUsuarioLogado: buscarListaSubunidadePorUsuarioLogado,
            buscarSubunidadeRespondente: buscarSubunidadeRespondente,
            buscaCargoFuncaoSiapPorUsuario: buscaCargoFuncaoSiapPorUsuario,
            gerarRelatorioExcel: gerarRelatorioExcel,
            buscarUnidadeSic: buscarUnidadeSic
        };
    }

})();
