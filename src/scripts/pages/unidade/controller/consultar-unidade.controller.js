(function () {
    'use strict';
    angular.module('sdsicApp').controller('ConsultarUnidadeController', ['$element', '$state', '$mdToast', '$log', 'UnidadeService', controller]);
    function controller($element, $state, $mdToast, $log, UnidadeService) {
        var me = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.searchTerm = "";
        me.defaultOrgao = {
            id: "235876",
            nome: "Ministério da Economia",
            sigla: "ME"
        };
        me.orgaosSiorg = [];
        me.unidadeSiorg = [];
        me.subunidadesSiorg = [];
        me.orgaoUnidadeSubunidade = [];
        me.defaultOrgao = {};
        me.defaultUnidade = {};
        me.defaultSubunidade = [];

        // Declaração de metodos publicos-------------------------------------------------------------------------------
        me.clearSearchTerm = function () {
            me.searchTerm = '';
        };

        me.loadUnidades = function (codigoOrgano) {
            UnidadeService.listaUnidadeDataBase(codigoOrgano).then(function(response) {
                me.unidadeSiorg = response.data;
            });
        };

        me.loadSubunidade = function (subunidade) {
            me.subunidadesSiorg = subunidade;
        };

        me.limpar = function () {
            me.orgaosSiorg = [];
            me.unidadeSiorg = [];
            me.subunidadesSiorg = [];
            me.defaultOrgao = {};
            me.defaultUnidade = {};
            me.defaultSubunidade = [];
        };

        me.cadastrar = function () {
            UnidadeService.obterResponsavelRecurso().then(function(response) {
                window.sessionStorage.setItem('responsavelRecurso', JSON.stringify(response.data));
                $state.go("cadastrarAtribuirUnidade", {
                    "responsavelRecurso": response.data,
                });
            });
        };

        me.editar = function (codigoUnidade) {
            UnidadeService.obterCadastro(codigoUnidade).then(function(response) {
                window.sessionStorage.setItem('title', "Editar Unidade/Subunidade");
                window.sessionStorage.setItem('unidadePadrao', JSON.stringify(response.data));
                $state.go("editarAtribuirUnidade", {
                    "title": "Editar Unidade/Subunidade",
                    "unidadePadrao": response.data,
                });
            });
        };

        me.consultar = function () {
            me.orgaoUnidadeSubunidade = [];
            if (me.defaultOrgao.hasOwnProperty("id")) {
                var defaultUnidade = [];

                if (me.defaultUnidade.hasOwnProperty("nomeUnidade")) {
                    defaultUnidade.push(me.defaultUnidade);
                    if (me.defaultSubunidade.length > 0) {
                        defaultUnidade[0].subunidade = me.defaultSubunidade;
                    }
                    else {
                        defaultUnidade[0].subunidade = me.subunidadesSiorg;
                    }
                }
                else {
                    defaultUnidade = me.unidadeSiorg;
                }
                me.orgaoUnidadeSubunidade = [{
                    id: me.defaultOrgao.id,
                    nomeOrgao: me.defaultOrgao.nomeUnidade,
                    siglaOrgao: me.defaultOrgao.siglaUnidade,
                    unidades: defaultUnidade
                }];
            }
            else {
                UnidadeService.listarTudoDataBase().then(function(response) {
                    me.orgaoUnidadeSubunidade = response.data;
                });
            }
        };

        me.detalhar = function (codigoUnidade) {
            UnidadeService.obterCadastro(codigoUnidade).then(function(response) {
                window.sessionStorage.setItem('title', "Detalhar Unidades/Subunidades");
                window.sessionStorage.setItem('unidadePadrao', JSON.stringify(response.data));
                $state.go("detalharUnidade", {
                    "title": "Detalhar Unidades/Subunidades",
                    "unidadePadrao": response.data,
                });
            });
        };

        me.gerarRelatorioExcel = function () {
            var fitro = {
                orgaoId: me.defaultOrgao.hasOwnProperty("id") ? me.defaultOrgao.id : null,
                unidadeId: me.defaultUnidade.hasOwnProperty("id") ? me.defaultUnidade.id : null,
                subunidade: me.defaultSubunidade
            };
            UnidadeService.gerarRelatorioExcel(fitro).then(function (successResponse) {
                var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                var nomeArquivo = 'ConsultaUnidade.xls';
                var link = document.createElement('a');
                if (typeof link.download === 'string') {
                    link.href = arquivoBase64;
                    link.download = nomeArquivo;
                    //Firefox requires the link to be in the body
                    document.body.appendChild(link);
                    //simulate click
                    link.click();
                    //remove the link when done
                    document.body.removeChild(link);
                } else {
                    window.open(arquivoBase64);
                }
            }, function (errorResponse) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Ocorreu um erro não esperado ao gerar o relatório excel.")
                        .hideDelay(3000)
                );
                $log.log(errorResponse);
            });
        };
        // Implementação de metodos observadores------------------------------------------------------------------------
        $element.find('input').on('keydown', function (ev) {
            ev.stopPropagation();
        });

        // Implementação de metodos privados ---------------------------------------------------------------------------
        function listarOrgao () {
            UnidadeService.listarOrgaoDataBase().then(function(response) {
                me.orgaosSiorg = response.data;
            });
        }

        function init() {
            listarOrgao();
        }

        // Inicialização da controller----------------------------------------------------------------------------------
        init();
    }
})();
