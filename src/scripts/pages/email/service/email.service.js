(function () {
    'use strict';
    angular.module('sdsicApp').factory('EmailService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/email';

        function listarEmail(filtro) {
            return $http.get(URL_FKSOLUTIONS + "/listar", {
                params: {
                    filtro: filtro
                }
            });
        }

        function listarAssunto() {
            return $http.get(URL_FKSOLUTIONS + "/listarAssunto");
        }

        function salvar(dados) {
            return $http.post(URL_FKSOLUTIONS + "/salvar", dados);
        }

        function listaTipoDataPorSolicitacao(tipoSolicitacao) {
            return $http.get(URL_FKSOLUTIONS + "/listaTipDataPorSolicitacao/" + tipoSolicitacao);
        }

        function listaTipoDataEnvio() {
            return $http.get(URL_FKSOLUTIONS + "/listaTipoDataEnvio");
        }

        function listaStatusDemandaPedido() {
            return $http.get(URL_FKSOLUTIONS + "/listaStatusDemandaPedido");
        }

        function listaStatusDemandaRecurso() {
            return $http.get(URL_FKSOLUTIONS + "/listaStatusDemandaRecurso");
        }

        function listaAcoesExecutadasPedido() {
            return $http.get(URL_FKSOLUTIONS + "/listaAcoesExecutadasPedido");
        }

        function listaAcoesExecutadasRecurso() {
            return $http.get(URL_FKSOLUTIONS + "/listaAcoesExecutadasRecurso");
        }

        function listaPerfilPorTipoSolicitacao(tipoSolicitacao) {
            return $http.get(URL_FKSOLUTIONS + "/listaPerfilPorTipoSolicitacao/" + tipoSolicitacao);
        }

        function buscaPorId(id) {
            return $http.get(URL_FKSOLUTIONS + "/buscaPorId/" + id)
        }

        function deletarEmail(id) {
            return $http.delete(URL_FKSOLUTIONS + '/deletarEmail/' + id)
        }

        return {
            salvar: salvar,
            listarEmail: listarEmail,
            listarAssunto: listarAssunto,
            listaTipoDataPorSolicitacao: listaTipoDataPorSolicitacao,
            listaTipoDataEnvio: listaTipoDataEnvio,
            listaStatusDemandaPedido: listaStatusDemandaPedido,
            listaStatusDemandaRecurso: listaStatusDemandaRecurso,
            listaAcoesExecutadasPedido: listaAcoesExecutadasPedido,
            listaAcoesExecutadasRecurso: listaAcoesExecutadasRecurso,
            listaPerfilPorTipoSolicitacao: listaPerfilPorTipoSolicitacao,
            buscaPorId: buscaPorId,
            deletarEmail: deletarEmail
        };
    }

})();
