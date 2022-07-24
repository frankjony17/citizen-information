(function () {

    'use strict';

    angular.module('sdsicApp').factory('FeriadoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api/';

        function salvarFeriado(cadastrarFeriado) {
            return $http.post(URL_FKSOLUTIONS + 'feriado', cadastrarFeriado);
        }

        function consultarFeriado(consultar) {
            return $http.get(URL_FKSOLUTIONS + 'feriado', {
                params: {
                    consultar : consultar
                }
            });
        }

        function editarFeriado(id) {
            return $http.get(URL_FKSOLUTIONS + 'feriado/editarFeriado/' + id);
        }


        function deletarFeriado(id) {
            return $http.delete(URL_FKSOLUTIONS + 'feriado/deletarFeriado/' + id);
        }

        function editarFeriadoSdsic(editarFeriado) {
            return $http.post(URL_FKSOLUTIONS + 'feriado/editarFeriadoSdsic', editarFeriado);
        }

        return {
            salvarFeriado : salvarFeriado,
            consultarFeriado: consultarFeriado,
            editarFeriado: editarFeriado,
            deletarFeriado: deletarFeriado,
            editarFeriadoSdsic: editarFeriadoSdsic
        };
    }

})();
