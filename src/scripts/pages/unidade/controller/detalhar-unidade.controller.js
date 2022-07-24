(function () {
    'use strict';
    angular.module('sdsicApp').controller('DetalharUnidadeController' , ['$state', '$stateParams', controller]);
    function controller($state, $stateParams) {
        var me = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.temp = {};
        me.temp.bool = {};
        me.temp.bool.autoridade = {};
        me.title = $stateParams.title;
        me.unidadePadrao = $stateParams.unidadePadrao;
        if (me.unidadePadrao === null) {
            me.title = sessionStorage.getItem("title");
            me.unidadePadrao = JSON.parse(sessionStorage.getItem("unidadePadrao"));
        }
        me.defaultOrgao = me.unidadePadrao.orgao;
        me.defaultUnidade = me.unidadePadrao.unidade;
        me.defaultSubunidade = me.unidadePadrao.unidade.subunidade;
        me.unidadeEstado = me.defaultUnidade.statusUnidade;
        me.autoridadeMaxima = me.unidadePadrao.usuarioAutoridadeMaxima;
        me.autoridadeHierarquica = me.unidadePadrao.usuarioAutoridadeHierarquica;
        me.substitutoAutoridadeMaxima = me.unidadePadrao.substitutoAutoridadeMaxima;
        me.substitutoAutoridadeHierarquica = me.unidadePadrao.substitutoAutoridadeHierarquica;
        me.responsavelRecursoQuartaInstancia = me.unidadePadrao.responsavelRecurso.responsavelRecursoQuartaInstancia;
        me.responsavelRecursoTerceiraInstancia = me.unidadePadrao.responsavelRecurso.responsavelRecursoTerceiraInstancia;

        me.substitutos = {
            primera: {
                bool: false,
                value: 'Titular'
            },
            segunda: {
                bool: false,
                value: 'Titular'
            }
        };
        me.temp.bool.autoridade.hier = true;
        me.temp.bool.autoridade.maxi = true;

        me.editar = function () {
            $state.go("editarAtribuirUnidade", {
                "title": "Editar Unidades/Subunidades",
                "unidadePadrao": me.unidadePadrao
            });
        };

        me.voltar = function () {
            $state.go("consultarUnidade");
        };

        function init () {
            if (me.substitutoAutoridadeMaxima != null) {
                me.substitutos.segunda.bool = true;
            }
            if (me.substitutoAutoridadeHierarquica != null) {
                me.substitutos.primera.bool = true;
            }
            if (me.autoridadeMaxima != null) {
                me.obterAutoridadeMaxima = true;
            }
            if (me.autoridadeHierarquica != null) {
                me.obterAutoridadeHierarquica = true;
            }
        }

        init();
    }
})();
