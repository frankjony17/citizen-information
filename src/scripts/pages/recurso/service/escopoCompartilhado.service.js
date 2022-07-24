'use strict';

angular.module('sdsicApp').service('escopoCompartilhadoService', [function(){
    var flag = undefined;
    var elementos = [];
    var object = {
        total: undefined,
        paginas: undefined,
        page: undefined,
        limit: undefined
    };
    var filtroConsulta = {};

    var paginacao = {
        limit: undefined,
        limitsPage: undefined,
        page: undefined
    };


    function carregarElementos(filtroElementos) {
        elementos = filtroElementos;
    }

    function carregarLimites(total,paginas,page,limit) {
        object.total = total;
        object.paginas= paginas;
        object.page = page;
        object.limit = limit;
    }


    function carregarFiltroConsulta(filtro) {
        filtroConsulta = filtro;
    }

    function carregarPaginacao(limit,limitsPage,page) {
        paginacao.limit = limit;
        paginacao.limitsPage = limitsPage;
        paginacao.page = page;
    }
    function carregarFlag(situacao) {
        flag = situacao;
    }
    function getElementos(){
        return elementos;
    }

    function getLimites() {
        return object;
    }

    function getFiltro() {
        return filtroConsulta;
    }

    function getPaginacao() {
        return paginacao;
    }

    function getFlag() {
        return flag;
    }




    return {
        getElementos: getElementos,
        carregarElementos: carregarElementos,
        carregarLimites: carregarLimites,
        carregarFiltroConsulta: carregarFiltroConsulta,
        carregarPaginacao: carregarPaginacao,
        carregarFlag: carregarFlag,
        getLimites: getLimites,
        getFiltro: getFiltro,
        getPaginacao: getPaginacao,
        getFlag: getFlag
    }

}]);
