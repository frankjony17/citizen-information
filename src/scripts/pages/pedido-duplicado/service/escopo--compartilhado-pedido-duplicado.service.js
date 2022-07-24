'use strict';

angular.module('sdsicApp').service('EscopoCompartilhadoPedidoDuplicadoService', [function(){

    var idPedidoPai = undefined;

    var pagina = undefined;

    function carregarIdPedidoPai(id) {
        idPedidoPai = id;
    }

    function getIdPedidoPai() {
        return idPedidoPai;
    }

    function setPagina(nomePagina) {
        pagina = nomePagina;
    }

    function getPagina() {
        return pagina;
    }

    return {
        carregarIdPedidoPai: carregarIdPedidoPai,
        getIdPedidoPai: getIdPedidoPai,
        setPagina: setPagina,
        getPagina: getPagina
    }

}]);
