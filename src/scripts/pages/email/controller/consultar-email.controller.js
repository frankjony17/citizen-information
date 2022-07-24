(function () {
    'use strict';
    angular.module('sdsicApp').controller('ConsultarEmailController', ['$state', '$mdDialog' ,'$mdToast', '$log', 'EmailService', 'MensagensService', controller]);
    function controller($state, $mdDialog, $mdToast, $log, EmailService, MensagensService) {
        var
        me = this,
        destinatarioPedidoComboList = [],
        destinatarioRecursoComboList = [];
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.tipoSolicitacaoModel = null;
        me.tipoSolicitacaoList = [{
            id: 1, nome: "Pedido"
        },{
            id: 2, nome: "Recurso"
        }];
        me.tipoAlertaModel = null;
        me.tipoAlertaList = [{
            id: 1, nome: "Data"
        },{
            id: 2, nome: "Ação"
        }];
        me.destinatarioModel = [];
        me.destinatarioList = [];
        me.assuntoModel = null;
        me.assuntoList = [];
        me.emailList = [];
        me.tabelaConsulta = {
            limit: 10,
            limitsPage: [10, 15, 25],
            page: 1,
            total: 0
        };
        me.totalElementosConsulta = 0;

        // Declaração de metodos publicos-------------------------------------------------------------------------------

        me.limpar = function () {
            me.tipoSolicitacaoModel = null;
            me.tipoAlertaModel = null;
            me.assuntoModel = null;
            me.destinatarioModel = [];
        };

        me.consultar = function () {
            me.emailList = [];
            var filtro = {
                tipoSolicitacao: me.tipoSolicitacaoModel != null ? me.tipoSolicitacaoModel.id : null,
                tipoAlerta: me.tipoAlertaModel != null ? me.tipoAlertaModel.id : null,
                assuntoEmail: me.assuntoModel,
                destinatarios: me.destinatarioModel,
                limit: me.tabelaConsulta.limit,
                offset: me.tabelaConsulta.page - 1
            };
            EmailService.listarEmail(filtro).then(function(response) {
                me.emailList = response.data.resultado;
                me.totalElementosConsulta = response.data.totalElementos;
            },function (response) {
                console.log("Erro, listarEmail: ", response);
            });
        };

        me.cadastrar = function () {
            $state.go("formularioEmailAlerta", { acao: "cadastro", id: null });
        };

        me.comboTipoSolicitacaoChange = function (value) {
            if (value === "Pedido") {
                me.destinatarioList = destinatarioPedidoComboList;
            } else {
                me.destinatarioList = destinatarioRecursoComboList;
            }
        };

        me.editar = function (email) {
            $state.go("formularioEmailAlerta", { acao: "editar", id: email.id });
        };

        me.detalhar = function (email) {
            $state.go("formularioEmailAlerta", { acao: "visualizar", id: email.id });
        };

        me.excluir = function (id, ev) {
            var confirm = $mdDialog.confirm()
                .textContent( 'Deseja remover este e-mail? Os dados não poderão ser recuperados.' )
                .targetEvent( ev )
                .ok( 'Sim' )
                .cancel( 'Não' );
            $mdDialog.show(confirm).then(function () {
                EmailService.deletarEmail(id).then(
                    function (response) {
                        var indice;
                        for (var i = 0; i < me.emailList.length; i++) {
                            me.cadastroEmail = response.data;
                            indice = i;
                            break;
                        }
                        me.emailList.splice(indice, 1);
                        MensagensService.exibirMensagemSucesso("E-mail excluído com sucesso");
                    }
                )
            })
        };

        // Implementação de metodos privados ---------------------------------------------------------------------------
        function listarAssunto () {
            EmailService.listarAssunto().then(function(response) {
                me.assuntoList = response.data;
            }, function (response) {
                console.log('Erro, listarAssunto: ', response);
            });
        }

        function init() {
            destinatarioPedidoComboList.push({ id: 2, nome: "Administrador FKSOLUTIONS" });
            destinatarioPedidoComboList.push({ id: 1, nome: "Atendente SIC" });
            destinatarioPedidoComboList.push({ id: 5, nome: "Ponto Focal (PF)" });
            destinatarioPedidoComboList.push({ id: 8, nome: "Respondente" });
            destinatarioPedidoComboList.push({ id: 9, nome: "Técnico" });
            //
            destinatarioRecursoComboList.push({ id: 2, nome: "Administrador FKSOLUTIONS" });
            destinatarioRecursoComboList.push({ id: 1, nome: "Atendente SIC" });
            destinatarioRecursoComboList.push({ id: 6, nome: "Autoridade Hierárquica" });
            destinatarioRecursoComboList.push({ id: 4, nome: "Autoridade Máxima" });
            destinatarioRecursoComboList.push({ id: 10, nome: "Ponto Focal Autoridade Máxima (PF)" });
            //
            listarAssunto();
        }

        // Inicialização da controller----------------------------------------------------------------------------------
        init();
    }
})();
