(function () {

    'use strict';

    angular.module('sdsicApp').factory('PedidoDuplicadoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarPedidoSolicitante(idPedido, offset, limit) {
            return $http.get(URL_FKSOLUTIONS + '/pedido/consultarPedidoSolicitante', {
                params: {
                    idSolicitante: idPedido,
                    offset: offset,
                    limit: limit
                }
            });
        }

        function consultarPedidoPeloProtocolo(protocolo) {
            return $http.get(URL_FKSOLUTIONS + '/pedidoDuplicado/buscarPedidoPeloProtocolo', {
                params: {
                    protocolo: protocolo
                }
            });
        }

        function vincularPedidoDuplicado(idPedidoDuplicado, idPedido) {
            return $http.get(URL_FKSOLUTIONS + "/pedidoDuplicado/vincularPedidoDuplicado/", {
                params: {
                    idPedidoDuplicado: idPedidoDuplicado,
                    idPedido: idPedido
                }
            });
        }

        function buscarPedidoPaiPedidoDuplicado(idPedido) {
            return $http.get(URL_FKSOLUTIONS + "/pedidoDuplicado/buscarPedidoPaiPedidoDuplicado/" + idPedido);
        }

        function buscarProtocoloPedidoPai(idPedido) {
            return $http.get(URL_FKSOLUTIONS + "/pedidoDuplicado/buscarProtocoloPedidoPai/" + idPedido);
        }

        return {
            consultarPedidoSolicitante: consultarPedidoSolicitante,
            consultarPedidoPeloProtocolo: consultarPedidoPeloProtocolo,
            vincularPedidoDuplicado: vincularPedidoDuplicado,
            buscarPedidoPaiPedidoDuplicado: buscarPedidoPaiPedidoDuplicado,
            buscarProtocoloPedidoPai: buscarProtocoloPedidoPai,
        };

    }



})();
