(function () {
    'use strict';
    angular.module('sdsicApp').controller('CadastrarUnidadeController' , ['$element', '$rootScope', '$state', '$mdToast', '$mdDialog', '$stateParams', 'UnidadeService', 'MensagensService', controller]);
    function controller($element, $rootScope, $state, $mdToast, $mdDialog, $stateParams, UnidadeService, MensagensService) {
        var me = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.searchTerm = "";
        me.defaultOrgao = {
            codigoUnidade: "235876",
            nomeUnidade: "Ministério da Economia",
            siglaUnidade: "ME"
        };
        me.orgaoLength = 0;
        me.unidadeLength = 0;
        me.subunidadeLength = 0;

        me.orgaosSiorg = [];
        me.unidadeSiorg = [];
        me.defaultUnidade = {};
        me.autoridadeMaxima = "";
        me.subunidadesSiorg = [];
        me.defaultSubunidade = [];
        me.autoridadeHierarquica = "";
        me.responsavelRecursoAcion = "MANTENER";
        me.usuarioAutoridadeHierarquica = [];
        me.usuarioAutoridadeMaxima = [];
        me.usuarioAutoridadeHierarquica = [];

        me.substitutoAutoridadeMaxima = {};
        me.substitutoAutoridadeHierarquica = {};
        me.usuarioSubstitutoAutoridadeMaxima = [];
        me.usuarioSubstitutoAutoridadeHierarquica = [];

        me.responsavelRecurso = $stateParams.responsavelRecurso;
        if ($stateParams.responsavelRecurso === null) {
            me.responsavelRecurso = JSON.parse(window.sessionStorage.getItem("responsavelRecurso"));
        }
        me.responsavelRecursoQuartaInstancia = me.responsavelRecurso.responsavelRecursoQuartaInstancia;
        me.responsavelRecursoTerceiraInstancia = me.responsavelRecurso.responsavelRecursoTerceiraInstancia;
        // Temp
        me.responsavelRecursoQuartaInstanciaTemp = me.responsavelRecursoQuartaInstancia;
        me.responsavelRecursoTerceiraInstanciaTemp = me.responsavelRecursoTerceiraInstancia;
        me.temp = [];
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

        me.obterAutoridadeMaxima = false;
        me.obterAutoridadeHierarquica = false;
        me.isReadonlyAutoridadeHierarquica = true;
        me.isReadonlyAutoridadeHierarquicaSub = true;
        me.isReadonlyAutoridadeMaxima = true;
        me.isReadonlyAutoridadeMaximaSub = true;

        // Implementação de metodos publicos ---------------------------------------------------------------------------
        me.clearSearchTerm = function () {
            me.searchTerm = '';
        };

        me.adicionarSubstitutoPrimeraInstancia = function () {
            me.substitutos.primera.bool = true;
        };

        me.adicionarSubstitutoSegundaInstancia = function () {
            me.substitutos.segunda.bool = true;
        };

        me.removeSubstitutoPrimeraInstancia = function (ev) {
            if (me.substitutoAutoridadeHierarquica.hasOwnProperty("cpf")) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(ev)).then(function() {
                    me.substitutoAutoridadeHierarquica = {};
                    me.substitutos.primera.bool = false;
                });
            } else {
                me.substitutos.primera.bool = false;
            }
            add();
        };

        me.removeSubstitutoSegundaInstancia = function (ev) {
            if (me.substitutoAutoridadeMaxima.hasOwnProperty("cpf")) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(ev)).then(function() {
                    me.substitutoAutoridadeMaxima = {};
                    me.substitutos.segunda.bool = false;
                });
            } else {
                me.substitutos.segunda.bool = false;
            }
            add();
        };

        me.loadUnidadesSiorg = function (orgao) {
            UnidadeService.listarUnidadeSiorg(orgao.codigoUnidade).then(function (response) {
                me.unidadeSiorg = response.data;
                me.unidadeLength = me.unidadeSiorg.length;
            }).then(function () {
                if (orgao.codigoUnidade == '235876') {
                    UnidadeService.buscaUnidadePorNome('SIC').then(function (response) {
                        var result = response.data;
                        var unidadeSic = {};
                        if (result) {
                            unidadeSic = {
                                id: result.id,
                                nome: result.nomeUnidade,
                                nomeUnidade: result.nomeUnidade,
                                sigla: result.siglaUnidade,
                                siglaUnidade: result.siglaUnidade,
                                codigoUnidade: result.codigoUnidade,
                                codigoUnidadePai: null,
                                codigoTipoUnidade: null,
                            }
                        } else {
                            unidadeSic = {
                                id: 1,
                                nome: 'SIC',
                                nomeUnidade: 'SIC',
                                sigla: 'SIC',
                                siglaUnidade: 'SIC',
                                codigoUnidade: 'SIC',
                                codigoUnidadePai: null,
                                codigoTipoUnidade: null
                            };
                        }
                        me.unidadeSiorg.unshift(unidadeSic);
                    });
                }
            });
        };

        me.colorNoUsuario = function (nomeUsuario) {
            var bool = false;
            if (nomeUsuario.search("Usuário atribuído à unidade:") != -1) {
                bool = true;
            }
            if (nomeUsuario.search("Usuário inexistente no acessos") != -1) {
                bool = true;
            }
            return bool;
        };

        me.loadSubUnidadesSiorg = function (unidade) {
            UnidadeService.subunidadeEUnidade(unidade.codigoUnidade).then(function(response) {
                if (response.data.body === "UNIDADE-COMO-SUBUNIDADE") {
                    MensagensService.dialogoAlerta("Unidade cadastrada como subunidade!", "Esta Unidade não pode ser cadastrada pois ela ja foi informada como uma Subunidade." );
                    me.defaultUnidade = {};
                }
                else {
                    UnidadeService.listarSubunidadeSiorg(unidade.codigoUnidade).then(function(response) {
                        if (response.data.hasOwnProperty("orgao")) {
                            window.sessionStorage.setItem('unidadePadrao', JSON.stringify(response.data));
                            $state.go("editarAtribuirUnidade", {
                                "unidadePadrao": response.data,
                            });
                        }
                        else {
                            me.subunidadesSiorg = response.data;
                            me.subunidadeLength = me.subunidadesSiorg.length;
                            loadUsuario();
                        }
                    });
                }
            });
        };

        me.autoridadeHierarquicaComboChange = function (event) {
            if (me.colorNoUsuario(me.autoridadeHierarquica.nome)) {
                showAvisoNoComboUsuario(me.autoridadeHierarquica, event);
                me.autoridadeHierarquica = {};
            }
            else {
                me.obterAutoridadeHierarquica = true;
                buscaCargoFuncaoAutoridadeHierarquica(me.autoridadeHierarquica.cpf);
                loadUsuarioSubstitutoAutoridadeHierarquica();
            }
            clearCombo(me.autoridadeHierarquica,"TAH");
        };

        me.substitutoAutoridadeHierarquicaComboChange = function (event) {
            if (me.colorNoUsuario(me.substitutoAutoridadeHierarquica.nome)) {
                showAvisoNoComboUsuario(me.substitutoAutoridadeHierarquica, event);
                me.substitutoAutoridadeHierarquica = {};
            }
            buscaCargoFuncaoAutoridadeHierarquicaSubstituto(me.substitutoAutoridadeHierarquica.cpf);
            clearCombo(me.substitutoAutoridadeHierarquica, "SAH");
        };

        me.substitutoAutoridadeMaximaComboChange = function (event) {
            if (me.colorNoUsuario(me.substitutoAutoridadeMaxima.nome)) {
                showAvisoNoComboUsuario(me.substitutoAutoridadeMaxima, event);
                me.substitutoAutoridadeMaxima = {};
            }
            buscaCargoFuncaoAutoridadeMaximaSubstituto(me.substitutoAutoridadeMaxima.cpf);
            clearCombo(me.substitutoAutoridadeMaxima, "SAM");
        };

        me.autoridadeMaximaComboChange = function () {
            if (me.colorNoUsuario(me.autoridadeMaxima.nome)) {
                showAvisoNoComboUsuario(me.autoridadeMaxima, event);
                me.autoridadeMaxima = {};
            }
            else {
                me.obterAutoridadeMaxima = true;
                buscaCargoFuncaoAutoridadeMaxima(me.autoridadeMaxima.cpf);
                loadUsuarioSubstitutoAutoridadeMaxima();
            }
            clearCombo(me.autoridadeMaxima, "TAM");
        };

        me.isValid = function (ev) {
            if (validityFields()) {
                var titulo = "Deseja continuar?",
                    mensagem = "A alteração dos dados de responsável por recurso de 3ª e 4ª instância será aplicada para todas as Unidades e Subunidades cadastradas no sistema";

                if (me.responsavelRecursoQuartaInstancia !== me.responsavelRecursoQuartaInstanciaTemp || me.responsavelRecursoTerceiraInstancia !== me.responsavelRecursoTerceiraInstanciaTemp) {
                    $mdDialog.show(MensagensService.dialogoConfirmacao(titulo, mensagem, ev)).then(function() {
                        salvar("ALTERAR");
                    }, function () {
                        me.responsavelRecursoQuartaInstancia = me.responsavelRecursoQuartaInstanciaTemp;
                        me.responsavelRecursoTerceiraInstancia = me.responsavelRecursoTerceiraInstanciaTemp;
                        salvar("MANTENER");
                    });
                } else {
                    salvar(me.responsavelRecursoAcion);
                }
            }
        };

        me.voltar = function () {
            $state.go("consultarUnidade");
        };

        // Implementação de metodos observadores------------------------------------------------------------------------
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        // Implementação de metodos privados----------------------------------------------------------------------------
        function listarOrgaoSiorg () {
            UnidadeService.listarOrgaoSiorg().then(function(response) {
                me.orgaosSiorg = response.data;
                me.orgaoLength = me.orgaosSiorg.length;
            });
        }

        function loadUsuarioSubstitutoAutoridadeHierarquica() { // PerfilAcessoEnum, AUTORIDADE_HIERARQUICA = 6.
            UnidadeService.listarUsuarioSubstitutoPorPerfil("FKSOLUTIONS.AUTORIDADE.HIERARQUICA", me.autoridadeHierarquica.id).then(function (response) {
                me.usuarioSubstitutoAutoridadeHierarquica = response.data;
            });
        }

        function loadUsuarioSubstitutoAutoridadeMaxima () { // PerfilAcessoEnum, AUTORIDADE_MAXIMA = 4.
            UnidadeService.listarUsuarioSubstitutoPorPerfil("FKSOLUTIONS.AUTORIDADE.MAXIMA",  me.autoridadeMaxima.id).then(function(response) {
                me.usuarioSubstitutoAutoridadeMaxima = [];
                if (response.data != null) {
                    response.data.forEach(function (rec) {
                        if (rec.cpf != me.autoridadeHierarquica.cpf && rec.cpf != me.substitutoAutoridadeHierarquica.cpf) {
                            me.usuarioSubstitutoAutoridadeMaxima.push(rec);
                        }
                    });
                }
            });
        }

        function loadUsuario() {
            loadUsuarioAutoridadeHierarquica();
            loadUsuarioAutoridadeMaxima();
        }

        function loadUsuarioAutoridadeHierarquica() { // PerfilAcessoEnum, AUTORIDADE_HIERARQUICA = 6.
            if (me.usuarioAutoridadeHierarquica.length === 0) {
                UnidadeService.listarUsuarioPorPerfil("FKSOLUTIONS.AUTORIDADE.HIERARQUICA").then(function (response) {
                    me.usuarioAutoridadeHierarquica = response.data;
                });
            }
        }

        function loadUsuarioAutoridadeMaxima() { // PerfilAcessoEnum, AUTORIDADE_MAXIMA = 4.
            if (me.usuarioAutoridadeMaxima.length === 0) {
                UnidadeService.listarUsuarioPorPerfil("FKSOLUTIONS.AUTORIDADE.MAXIMA").then(function (response) {
                    me.usuarioAutoridadeMaxima = response.data;
                });
            }
        }

        function buscaCargoFuncaoAutoridadeHierarquica(cpf) {
            UnidadeService.buscaCargoFuncaoSiapPorUsuario(cpf)
                .then(function (response) {
                    var dados = response.data;
                    me.autoridadeHierarquica.cargo = dados.cargo;
                    me.autoridadeHierarquica.funcao = dados.funcao;
                }).then(function () {
                    if (me.autoridadeHierarquica.cargo === undefined ||
                        me.autoridadeHierarquica.cargo.trim() === '') {
                        me.isReadonlyAutoridadeHierarquica = false;
                    } else {
                        me.isReadonlyAutoridadeHierarquica = true;
                    }
                });
        }

        function buscaCargoFuncaoAutoridadeHierarquicaSubstituto(cpf) {
            UnidadeService.buscaCargoFuncaoSiapPorUsuario(cpf)
                .then(function (response) {
                    var dados = response.data;
                    me.substitutoAutoridadeHierarquica.cargo = dados.cargo;
                    me.substitutoAutoridadeHierarquica.funcao = dados.funcao;
                }).then(function () {
                    if (me.substitutoAutoridadeHierarquica.cargo === undefined ||
                        me.substitutoAutoridadeHierarquica.cargo.trim() === '') {
                        me.isReadonlyAutoridadeHierarquicaSub = false;
                    } else {
                        me.isReadonlyAutoridadeHierarquicaSub = true;
                    }
                });
        }

        function buscaCargoFuncaoAutoridadeMaxima(cpf) {
            UnidadeService.buscaCargoFuncaoSiapPorUsuario(cpf)
                .then(function (response) {
                    var dados = response.data;
                    me.autoridadeMaxima.cargo = dados.cargo;
                    me.autoridadeMaxima.funcao = dados.funcao;
                }).then(function () {
                    if (me.autoridadeMaxima.cargo === undefined ||
                        me.autoridadeMaxima.cargo.trim() === '') {
                        me.isReadonlyAutoridadeMaxima = false;
                    } else {
                        me.isReadonlyAutoridadeMaxima = true;
                    }
                });
        }

        function buscaCargoFuncaoAutoridadeMaximaSubstituto(cpf) {
            UnidadeService.buscaCargoFuncaoSiapPorUsuario(cpf)
                .then(function (response) {
                    var dados = response.data;
                    me.substitutoAutoridadeMaxima.cargo = dados.cargo;
                    me.substitutoAutoridadeMaxima.funcao = dados.funcao;
                }).then(function () {
                    if (me.substitutoAutoridadeMaxima.cargo === undefined ||
                        me.substitutoAutoridadeMaxima.cargo.trim() === '') {
                        me.isReadonlyAutoridadeMaximaSub = false;
                    } else {
                        me.isReadonlyAutoridadeMaximaSub = true;
                    }
                });
        }

        function salvar (responsavel) {
            me.defaultUnidade.subunidade = me.defaultSubunidade;
            var dados = {
                orgao: me.defaultOrgao,
                unidade: me.defaultUnidade,
                usuarioAutoridadeHierarquica: curarNomeUsuario(me.autoridadeHierarquica),
                substitutoAutoridadeHierarquica: curarNomeUsuario(me.substitutoAutoridadeHierarquica),
                usuarioAutoridadeMaxima: curarNomeUsuario(me.autoridadeMaxima),
                substitutoAutoridadeMaxima: curarNomeUsuario(me.substitutoAutoridadeMaxima),
                responsavelRecurso: {
                    responsavelRecursoAcao: responsavel,
                    responsavelRecursoTerceiraInstancia: me.responsavelRecursoTerceiraInstancia,
                    responsavelRecursoQuartaInstancia: me.responsavelRecursoQuartaInstancia
                }
            };
            UnidadeService.salvar(dados).then(function() {
                MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                me.voltar();
            });
        }

        function validityFields () {
            var bool = true;
            angular.forEach(me.cadastrarUnidadeForm, function (field, name) {
                if (!name.startsWith('$')) {
                    if (!field.$valid) {
                        field.$setTouched();
                        MensagensService.exibirMensagemCamposObrigatorios();
                        bool = false;
                    }
                }
            });
            return bool;
        }

        function showAvisoNoComboUsuario(usuario, event) {
            var string = usuario.nome.replace("Usuário atribuído à unidade:", ""),
                splitName = string.split("["),
                nomeUsuario = splitName[0],
                nomeUnidade = splitName[1].replace("]", "");
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('O usuário já existe')
                    .textContent('O usuário '+ nomeUsuario +', já está atribuído à unidade: '+ nomeUnidade)
                    // .ariaLabel('Usuário existe!!!')
                    .ok('Ok')
                    .targetEvent(event)
            );
        }

        function mensagemDesejaRemoverEssaAutoridade(ev) {
            var titulo = "Deseja remover este substituto?",
                mensagem = "";
            return MensagensService.dialogoConfirmacao(titulo, mensagem, ev);
        }

        // true = [lista], false = {object}.
        function curarNomeUsuario (usuario) {
            if (usuario !== null && usuario.hasOwnProperty("nome")) {
                if (usuario.nome.includes("Usuário sem atribuição")) {
                    var nomeUser = usuario.nome.replace("Usuário sem atribuição", "");
                    // Replace all.
                    nomeUser = nomeUser.replace("[", "");
                    nomeUser = nomeUser.replace("]", "");
                    usuario.nome = nomeUser.trim();
                }
            }
            return usuario;
        }

        function clearCombo (item, nome) {
            add();
            if (nome != "TAH") { // Titular Autoridade Hierárquica 1ª Instância.
                me.usuarioAutoridadeHierarquica = rm(me.usuarioAutoridadeHierarquica, item, 'TAH');
            }
            if (nome != "SAH") { // Substituto Autoridade Hierárquica 1ª Instância.
                me.usuarioSubstitutoAutoridadeHierarquica = rm(me.usuarioSubstitutoAutoridadeHierarquica, item, 'SAH');
            }
            if (nome != "TAM") { // Titular Autoridade Máxima 2ª Instância.
                me.usuarioAutoridadeMaxima = rm(me.usuarioAutoridadeMaxima, item, 'TAM');
            }
            if (nome != "SAM") { // Substituto Autoridade Máxima 2ª Instância.
                me.usuarioSubstitutoAutoridadeMaxima = rm(me.usuarioSubstitutoAutoridadeMaxima, item, 'SAM');
            }
        }

        function add() {
            me.temp.forEach(function (rec) {
                var bool = existe(rec.item.cpf);
                if (!bool) {
                    if (me.usuarioAutoridadeHierarquica.indexOf(rec.item) === -1 && rec.nome === "TAH") {
                        me.usuarioAutoridadeHierarquica.push(rec.item);
                    }
                    if (me.usuarioSubstitutoAutoridadeHierarquica.indexOf(rec.item) === -1 && rec.nome === "SAH") {
                        me.usuarioSubstitutoAutoridadeHierarquica.push(rec.item);
                    }
                    if (me.usuarioAutoridadeMaxima.indexOf(rec.item) === -1 && rec.nome === "TAM") {
                        me.usuarioAutoridadeMaxima.push(rec.item);
                    }
                    if (me.usuarioSubstitutoAutoridadeMaxima.indexOf(rec.item) === -1 && rec.nome === "SAM") {
                        me.usuarioSubstitutoAutoridadeMaxima.push(rec.item);
                    }
                }
            });
        }

        function existe (cpf) {
            var bool = false;
            if (me.autoridadeHierarquica.cpf === cpf) {
                bool = true;
            }
            if (me.substitutoAutoridadeHierarquica.cpf === cpf) {
                bool = true;
            }
            if (me.autoridadeMaxima.cpf === cpf) {
                bool = true;
            }
            if (me.substitutoAutoridadeMaxima.cpf === cpf) {
                bool = true;
            }
            return bool;
        }

        function rm (array, item, nome) {
            array.forEach(function (rec, key) {
                if (rec.cpf === item.cpf) {
                    array.splice(key, 1);
                    me.temp.push({ nome: nome, item: item });
                }
            });
            return array;
        }

        function init () {
            listarOrgaoSiorg();
        }

        init();
    }
})();
