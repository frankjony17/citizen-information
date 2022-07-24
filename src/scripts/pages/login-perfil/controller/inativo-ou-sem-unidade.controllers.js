(function () {
    'use strict';
    angular.module('sdsicApp').controller("InativoSemUnidadeController", ['$http', controller]);
        function controller($http) {
            var me = this, URL_FKSOLUTIONS = 'sdsic/api';

            me.content = '';

            $http.get(URL_FKSOLUTIONS + "/usuario/alerta/load").then(function (response) {
                me.content = response.data.alerta;
            }, function (response) {
                console.log("Erro: AdminController->load() ", response);
            });
        }
})();
