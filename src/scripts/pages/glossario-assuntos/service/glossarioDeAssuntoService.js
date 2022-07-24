(function () {
    'use strict';
    angular.module('sdsicApp').factory('GlossarioDeAssuntoService', service);
    function service($http) {
        var URL_FKSOLUTIONS = 'sdsic/api/';

        function consultaGlossarioDeTema(consultar) {
            return $http.get(URL_FKSOLUTIONS + 'tema/filtrarGlossarioDeTemas', {
                params: {
                    consultar : consultar
                }
            });
        }

        function buscarPorSubtema(id) {
            return $http.get(URL_FKSOLUTIONS + 'tema/buscarPorSubtema/' + id);

        }

        function buscarTodosTemas() {
            return $http.get(URL_FKSOLUTIONS + 'tema/buscarTodosTemas');

        }

        function buscarGlossarioDeTemas(id) {
            return $http.get(URL_FKSOLUTIONS + 'tema/buscarGlossarioDeTemas/' + id);
        }

        function detalharTema(id) {
            return $http.get(URL_FKSOLUTIONS + "tema/detalharTema/" + id);
        }

        function buscarTodasPalavrasChaves() {
            return $http.get(URL_FKSOLUTIONS + "tema/buscarTodasPalavrasChaves");

        }

        function salvarGlossario(glossarioDeTemaDTO) {
            return $http.post(URL_FKSOLUTIONS + "tema/salvar/", glossarioDeTemaDTO);
        }

        function editarTema(glossarioDeTemaDTO) {
            return $http.post(URL_FKSOLUTIONS + "tema/editar/", glossarioDeTemaDTO);
        }

        function gerarRelatorioExcel(fitro) {
            return $http.get(URL_FKSOLUTIONS + '/tema/exportar', {
                params: {
                    filtro: fitro
                }
            });
        }

        return{
            consultaGlossarioDeTema: consultaGlossarioDeTema,
            buscarPorSubtema: buscarPorSubtema,
            buscarTodosTemas: buscarTodosTemas,
            buscarGlossarioDeTemas: buscarGlossarioDeTemas,
            detalharTema: detalharTema,
            salvarGlossario : salvarGlossario,
            editarTema: editarTema,
            buscarTodasPalavrasChaves: buscarTodasPalavrasChaves,
            gerarRelatorioExcel: gerarRelatorioExcel
        };
    }


})();
