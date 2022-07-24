(function () {

    'use strict';

    angular.module('sdsicApp').factory('AndamentoRecursoService', service);

    function service($http) {

        var URL_FKSOLUTIONS = 'sdsic/api';

        function consultarAndamentoRecurso(id, offset, limit) {
            return $http.get(URL_FKSOLUTIONS + '/andamentoRecurso/consultarAndamentoRecurso', {
                params: {
                    id: id,
                    offset: offset,
                    limit: limit
                }
            });
        }

        return {
            consultarAndamentoRecurso: consultarAndamentoRecurso
        };

    }

})();
