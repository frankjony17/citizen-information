/*
*
 * Created by Basis Tecnologia on 08/08/2016.
'use strict';
(function(){

    function service () {
        var _objetos = {};

        var _urlsPorAmbiente = {};

        function setObjetos (nomeObjeto, objeto) {
            _objetos[nomeObjeto] = objeto;
        }

        function getObjeto(nomeObjeto) {
            return _objetos[nomeObjeto];
        }

        function setUrlsPorAmbiente(urls) {
            return _urlsPorAmbiente = urls;
        }

        function getUrlsPorAmbiente() {
            return _urlsPorAmbiente;
        }

        function limparEscopo(){
            _objetos = {};
        }

        return {
            setObjetos: setObjetos,
            getObjeto: getObjeto,
            setUrlsPorAmbiente: setUrlsPorAmbiente,
            getUrlsPorAmbiente: getUrlsPorAmbiente,
            limparEscopo: limparEscopo
        };
    }

    angular
        .module('sdsicApp')
        .factory('escopoCompartilhadoService', [service]);

})();
*/
