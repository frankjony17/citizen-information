(function () {
    'use strict';
    angular.module('sdsicApp').controller('FormularioEmailController', ['$state', '$mdToast', '$mdDialog', '$stateParams', 'EmailService', 'MensagensService', controller]);
    function controller($state, $mdToast, $mdDialog, $stateParams, EmailService, MensagensService) {

        var TIPO_PEDIDO = 1;
        var TIPO_RECURSO = 2;

        var me = this,
            acao = $stateParams.acao,
            idEmailAlerta = $stateParams.id,
            tipoSolicitacao = 1,
            tipoAcao = 1,
            pedidoComboList = [],
            recursoComboList = [],
            statusDemandaPedidoComboList = [],
            statusDemandaRecursoComboList = [],
            acaoExecutadaPedidoComboList = [],
            acaoExecutadaRecursoComboList = [],
            destinatarioPedidoComboList = [],
            destinatarioRecursoComboList = [];

        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.isDisabled = false;

        me.id = null;
        me.radioTipoSolicitacao = 1;
        me.radioAlerta = 1;
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

        me.radioTipoSocilitacao = function (value) {
            if (tipoSolicitacao == value) {
                return;
            }
            limpar();
            if (value === TIPO_PEDIDO) {
                tipoSolicitacao = TIPO_PEDIDO;
                me.radioTipoSolicitacao = TIPO_PEDIDO;
                me.dataReferenciaList = pedidoComboList;
                me.statusDemandaList = statusDemandaPedidoComboList;
                me.acaoExecutadaList = acaoExecutadaPedidoComboList;
                me.destinatarioList = destinatarioPedidoComboList;
                listaStatusDemandaPedido();
                listaTipoDataPorSolicitacaoPedido(me.radioTipoSolicitacao);
                listaPerfilPorTipoSolicitacaoPedido();
                listaAcoesExecutadasPedido();
            } else {
                tipoSolicitacao = TIPO_RECURSO;
                me.radioTipoSolicitacao = TIPO_RECURSO;
                me.dataReferenciaList = recursoComboList;
                me.statusDemandaList = statusDemandaRecursoComboList;
                me.acaoExecutadaList = acaoExecutadaRecursoComboList;
                me.destinatarioList = destinatarioRecursoComboList;
                listaStatusDemandaRecurso();
                listaTipoDataPorSolicitacaoRecurso(me.radioTipoSolicitacao);
                listaPerfilPorTipoSolicitacaoRecurso();
                listaAcoesExecutadasRecurso();
            }
        };

        me.radioAlertaClick = function (value) {
            if (tipoAcao != value) {
                limpar();
                me.radioAlerta = value;
                tipoAcao = value;
            }
            if (tipoSolicitacao === TIPO_PEDIDO) {
                me.acaoExecutadaList = acaoExecutadaPedidoComboList;
            } else {
                me.acaoExecutadaList = acaoExecutadaRecursoComboList;
            }

        };

        me.isValid = function () {
            if (validityFields()) {
                var dados = {
                    id: me.id,
                    tipoSolicitacao: me.radioTipoSolicitacao,
                    tipoAlerta: me.radioAlerta,
                    dataReferencia: me.dataReferenciaModel.hasOwnProperty("id") ? me.dataReferenciaModel.id : null,
                    dataEnvioEmail: me.dataEnvioEmailModel.hasOwnProperty("id") ? me.dataEnvioEmailModel.id : null,
                    statusDemanda: me.statusDemandaModel.hasOwnProperty("id") ? me.statusDemandaModel.id : null,
                    diasAnteDataReferencia: me.diasAntesDataReferenciaModel ? me.diasAntesDataReferenciaModel : 0,
                    diasAposDataReferencia: me.diasAposDataReferenciaModel ? me.diasAposDataReferenciaModel : 0,
                    reenviarAteAlteracaoDoStatus: me.reenvioEmailAteAlteracaoStatusModel,
                    acaoExecutada: me.acaoExecutadaModel.hasOwnProperty("id") ? me.acaoExecutadaModel.id : 604,
                    destinatarios: me.destinatarioModel.length > 0 ? me.destinatarioModel : null,
                    assuntoEmail: me.assuntoEmailModel,
                    conteudoEmail: CKEDITOR.instances.editor1.getData()
                };
                salvar(dados);
            }
        };

        me.voltar = function () {
            $state.go("emailAlerta");
        };

        // Implementação de metodos privados----------------------------------------------------------------------------

        function salvar(dados) {
            EmailService.salvar(dados).then(function () {
                MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                me.voltar();
            }, function (response) {
                console.log("Erro, salvar(). ", response);
            });
        }

        function validityFields() {
            var bool = true;
            angular.forEach(me.cadastrarEmailForm, function (field, name) {
                if (!name.startsWith('$')) {
                    if (!field.$valid) {
                        field.$setTouched();
                        MensagensService.exibirMensagemCamposObrigatorios();
                        bool = false;
                    }
                }
            });
            if (CKEDITOR.instances.editor1.getData() === "") {
                MensagensService.exibirMensagemCamposObrigatorios();
                bool = false;
            }
            return bool;
        }

        function limpar() {
            me.acaoExecutadaModel = {};
            me.dataReferenciaModel = {};
            me.dataEnvioEmailModel = {};
            me.statusDemandaModel = {};
            me.statusDemandaModel = {};
            me.destinatarioModel = [];
            me.reenvioEmailAteAlteracaoStatusModel = false;
        }

        function listaTipoDataPorSolicitacaoPedido(tipo) {
            if (pedidoComboList.length === 0) {
                EmailService.listaTipoDataPorSolicitacao(tipo).then(function (response) {
                    if (response && response.data) {
                        var lista = response.data;
                        angular.forEach(lista, function (item) {
                            pedidoComboList.push({ id: item.id, nome: item.valor });
                        });
                        me.dataReferenciaList = pedidoComboList;
                    }
                });
            }
        }

        function listaTipoDataPorSolicitacaoRecurso(tipo) {
            if (recursoComboList.length === 0) {
                EmailService.listaTipoDataPorSolicitacao(tipo).then(function (response) {
                    if (response && response.data) {
                        var lista = response.data;
                        angular.forEach(lista, function (item) {
                            recursoComboList.push({ id: item.id, nome: item.valor });
                        });
                        me.dataReferenciaList = recursoComboList;
                    }
                });
            }
        }

        function listaTipoDataEnvio() {
            EmailService.listaTipoDataEnvio().then(function (response) {
                var lista = response.data;
                angular.forEach(lista, function (item) {
                    me.dataEnvioEmailList.push({ id: item.id, nome: item.valor });
                });
            });
        }

        function listaStatusDemandaPedido() {
            if (statusDemandaPedidoComboList.length === 0) {
                EmailService.listaStatusDemandaPedido().then(function (response) {
                    var lista = response.data;
                    angular.forEach(lista, function (item) {
                        statusDemandaPedidoComboList.push({ id: item.id, nome: item.nome });
                    });
                    me.statusDemandaList = statusDemandaPedidoComboList;
                });
            }
        }

        function listaStatusDemandaRecurso() {
            if (statusDemandaRecursoComboList.length === 0) {
                EmailService.listaStatusDemandaRecurso().then(function (response) {
                    var lista = response.data;
                    angular.forEach(lista, function (item) {
                        statusDemandaRecursoComboList.push({ id: item.id, nome: item.nome });
                    });
                    me.statusDemandaList = statusDemandaRecursoComboList;
                });
            }
        }

        function listaAcoesExecutadasPedido() {
            if (acaoExecutadaPedidoComboList.length === 0) {
                EmailService.listaAcoesExecutadasPedido().then(function (response) {
                    var lista = response.data;
                    angular.forEach(lista, function (item) {
                        acaoExecutadaPedidoComboList.push({ id: item.id, nome: item.valor });
                    });
                    me.acaoExecutadaList = acaoExecutadaPedidoComboList;
                });
            }
        }

        function listaAcoesExecutadasRecurso() {
            if (acaoExecutadaRecursoComboList.length === 0) {
                EmailService.listaAcoesExecutadasRecurso().then(function (response) {
                    var lista = response.data;
                    angular.forEach(lista, function (item) {
                        acaoExecutadaRecursoComboList.push({ id: item.id, nome: item.valor });
                    });
                    me.acaoExecutadaList = acaoExecutadaRecursoComboList;
                });
            }
        }

        function listaPerfilPorTipoSolicitacaoPedido() {
            if (destinatarioPedidoComboList.length === 0) {
                EmailService.listaPerfilPorTipoSolicitacao(TIPO_PEDIDO).then(function (response) {
                    if (response && response.data) {
                        var lista = response.data;
                        angular.forEach(lista, function (item) {
                            destinatarioPedidoComboList.push({ id: item.idPerfil, nome: item.descricao });
                        });
                        me.destinatarioList = destinatarioPedidoComboList;
                    }
                });
            }
        }

        function listaPerfilPorTipoSolicitacaoRecurso() {
            if (destinatarioRecursoComboList.length === 0) {
                EmailService.listaPerfilPorTipoSolicitacao(TIPO_RECURSO).then(function (response) {
                    if (response && response.data) {
                        var lista = response.data;
                        angular.forEach(lista, function (item) {
                            destinatarioRecursoComboList.push({ id: item.idPerfil, nome: item.descricao });
                        });
                        me.destinatarioList = destinatarioRecursoComboList;
                    }
                });
            }
        }

        function buscaPorId() {
            if ((acao === 'editar' || acao === 'visualizar') && idEmailAlerta) {
                EmailService.buscaPorId(idEmailAlerta).then(function (res) {
                    var email = res.data;
                    return email;
                }).then(function (email) {
                    listaTipoDataEnvio();
                    if (email.tipoSolicitacao === TIPO_PEDIDO) {
                        listaTipoDataPorSolicitacaoPedido(TIPO_PEDIDO)
                        listaAcoesExecutadasPedido();
                        listaStatusDemandaPedido();
                        listaPerfilPorTipoSolicitacaoPedido();
                    } else {
                        listaTipoDataPorSolicitacaoRecurso(TIPO_RECURSO);
                        listaAcoesExecutadasRecurso();
                        listaStatusDemandaRecurso();
                        listaPerfilPorTipoSolicitacaoRecurso();
                    }
                    return email;
                }).then(function (email) {
                    tipoSolicitacao = email.tipoSolicitacao;
                    tipoAcao = email.tipoAlerta;

                    me.id = email.id;
                    me.radioTipoSolicitacao = email.tipoSolicitacao;
                    me.radioAlerta = email.tipoAlerta;
                    me.dataReferenciaModel = { id: email.dataReferencia };
                    me.dataEnvioEmailModel = { id: email.dataEnvioEmail };
                    me.statusDemandaModel = { id: email.statusDemanda };
                    me.reenvioEmailAteAlteracaoStatusModel = email.reenviarAteAlteracaoDoStatus;
                    me.diasAntesDataReferenciaModel = email.diasAnteDataReferencia;
                    me.diasAposDataReferenciaModel = email.diasAposDataReferencia;
                    me.acaoExecutadaModel = { id: email.acaoExecutada };
                    var listaPerfis = []
                    angular.forEach(email.destinatarios, function (item) {
                        listaPerfis.push({ id: item.id, nome: item.nome });
                    });
                    me.destinatarioModel = listaPerfis;
                    me.assuntoEmailModel = email.assuntoEmail;
                    setTimeout(function () {
                        CKEDITOR.instances.editor1.setData(email.conteudoEmail);
                    }, 1000);
                });
            }
        }

        function init() {
            if (acao === 'cadastro') {
                listaStatusDemandaPedido();
                listaTipoDataPorSolicitacaoPedido(me.radioTipoSolicitacao);
                listaTipoDataEnvio();
                listaAcoesExecutadasPedido();
                listaAcoesExecutadasRecurso();
                listaPerfilPorTipoSolicitacaoPedido();
                listaPerfilPorTipoSolicitacaoRecurso();
            } else {
                if (acao === 'visualizar') {
                    me.isDisabled = true;
                    CKEDITOR.instances.editor1.config.readOnly = true;
                }
                buscaPorId();
            }
        }

        init();
    }
})();
