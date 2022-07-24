(function () {
    'use strict';
    angular.module('sdsicApp').controller('EditarEmailController', ['$state', '$mdToast', '$mdDialog', '$stateParams', 'EmailService', 'MensagensService', controller]);
    function controller($state, $mdToast, $mdDialog, $stateParams, EmailService, MensagensService) {
        var me = this,
            pedidoComboList = [],
            recursoComboList = [],
            statusDemandaPedidoComboList = [],
            statusDemandaRecursoComboList = [],
            acaoExecutadaPedidoComboList = [],
            acaoExecutadaRecursoComboList = [],
            destinatarioPedidoComboList = [],
            destinatarioRecursoComboList = [];
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.email = $stateParams.email;

        me.radioTipoSolicitacao = { pedido: 'Pedido', recurso: 'Pedido', value: 601 };
        me.radioAlerta = { data: 'Data', acao: 'Data', value: 603 };
        me.dataReferenciaModel = {};
        me.dataReferenciaList = [];
        me.dataEnvioEmailModel = {};
        me.dataEnvioEmailList = [];
        me.statusDemandaModel = {};
        me.statusDemandaList = [];
        me.destinatarioModel = [];
        me.destinatarioList = [];
        me.diasAntesDataReferenciaModel = 0;
        me.diasAposDataReferenciaModel = 0;
        me.reenvioEmailAteAlteracaoStatusModel = false;
        me.acaoExecutadaModel = {};
        me.acaoExecutadaList = [];
        me.assuntoEmailModel = "";

        // Implementação de metodos publicos ---------------------------------------------------------------------------

        me.voltar = function () {
            $state.go("emailAlerta");
        };

        // Implementação de métodos privados ---------------------------------------------------------------------------
        function buscaEmail() {
            console.log('teste', me.email);

            var idEmail = window.localStorage.getItem('id_email');
            if (idEmail) {

            }

        }

        function init() {
  
            buscaEmail();
        }
        init();
    }
})();
