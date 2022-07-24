(function () {
    'use strict';
    angular.module('sdsicApp').controller('EditarUnidadeController', ['$scope', '$element', '$state', '$mdToast', '$stateParams', '$mdDialog', 'UnidadeService', 'MensagensService', controller]);

    function controller($scope, $element, $state, $mdToast, $stateParams, $mdDialog, UnidadeService, MensagensService) {
        var me = this;
        // Declaração de variaveis -------------------------------------------------------------------------------------
        me.temp = {};
        me.temp.bool = {};
        me.temp.bool.autoridade = {};
        me.searchTerm = "";
        me.title = $stateParams.title;
        me.unidadePadrao = $stateParams.unidadePadrao;
        if (me.unidadePadrao === null) {
            me.title = window.sessionStorage.getItem("title");
            me.unidadePadrao = JSON.parse(window.sessionStorage.getItem("unidadePadrao"));
        }
        me.orgaoSiorg = [me.unidadePadrao.orgao];
        me.defaultOrgao = me.unidadePadrao.orgao;

        me.unidadeSiorg = [me.unidadePadrao.unidade];
        me.defaultUnidade = me.unidadePadrao.unidade;
        me.unidadeEstado = me.defaultUnidade.statusUnidade;
        me.disabledForm = !me.unidadeEstado;

        me.subunidadeList = me.unidadePadrao.subunidadeList;
        me.defaultSubunidade = me.unidadePadrao.unidade.subunidade.length === 0 ? null : me.unidadePadrao.unidade.subunidade;

        me.autoridadeMaxima = curarNomeUsuario(me.unidadePadrao.usuarioAutoridadeMaxima, null, false);
        me.usuarioAutoridadeMaximaList = curarNomeUsuario(null, me.unidadePadrao.usuarioAutoridadeMaximaList, true);

        me.autoridadeHierarquica = curarNomeUsuario(me.unidadePadrao.usuarioAutoridadeHierarquica, null, false);
        me.usuarioAutoridadeHierarquicaList = curarNomeUsuario(null, me.unidadePadrao.usuarioAutoridadeHierarquicaList, true);

        me.substitutoAutoridadeMaxima = curarNomeUsuario(me.unidadePadrao.substitutoAutoridadeMaxima, null, false);
        me.substitutoAutoridadeHierarquica = curarNomeUsuario(me.unidadePadrao.substitutoAutoridadeHierarquica, null, false);
        me.oldSubstitutoAutoridadeMaxima = null;
        me.oldSubstitutoAutoridadeHierarquica = null;

        me.responsavelRecursoQuartaInstancia = me.unidadePadrao.responsavelRecurso.responsavelRecursoQuartaInstancia;
        me.responsavelRecursoTerceiraInstancia = me.unidadePadrao.responsavelRecurso.responsavelRecursoTerceiraInstancia;
        // Temp
        me.responsavelRecursoAcao = "MANTENER";
        me.responsavelRecursoQuartaInstanciaTemp = me.unidadePadrao.responsavelRecurso.responsavelRecursoQuartaInstancia;
        me.responsavelRecursoTerceiraInstanciaTemp = me.unidadePadrao.responsavelRecurso.responsavelRecursoTerceiraInstancia;

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
        me.obterAutoridadeMaxima = true;
        me.obterAutoridadeHierarquica = true;
        me.temp.bool.autoridade.hier = true;
        me.temp.bool.autoridade.maxi = true;
        me.obterAutoridadeMaxima = false;
        me.obterAutoridadeHierarquica = false;

        // Implementação de metodos publicos----------------------------------------------------------------------------
        me.clearSearchTerm = function () {
            me.searchTerm = '';
        };

        me.titularAutoridadeHierarquicaComboChange = function (event) {
            if (me.colorNoUsuario(me.autoridadeHierarquica.nome)) {
                showAvisoNoComboUsuario(me.autoridadeHierarquica, event);
                me.autoridadeHierarquica = null;
            } else {
                if (me.substitutoAutoridadeHierarquica != null && me.autoridadeHierarquica.cpf === me.substitutoAutoridadeHierarquica.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Hierárquica 1ª Instância');
                    me.autoridadeHierarquica = null;
                }
                if (me.autoridadeMaxima != null && me.autoridadeHierarquica != null && me.autoridadeHierarquica.cpf === me.autoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais('Substituto Autoridade Máxima 2ª Instância');
                    me.autoridadeHierarquica = null;
                }
                if (me.substitutoAutoridadeMaxima != null && me.autoridadeHierarquica != null && me.autoridadeHierarquica.cpf === me.substitutoAutoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Máxima 2ª Instância');
                    me.autoridadeHierarquica = null;
                }
                me.obterAutoridadeHierarquica = true;
            }
        };

        me.onOpenComboSubstitutoAutoridadeHierarquica = function (event) {
            if (me.substitutoAutoridadeHierarquica.cpf !== me.oldSubstitutoAutoridadeHierarquica.cpf) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(event)).then(function() {
                    substitutoAutoridadeHierarquicaComboChange(event);
                }, function () {
                    me.substitutoAutoridadeHierarquica = me.oldSubstitutoAutoridadeHierarquica;
                });
            }
        };

        me.onOpenComboSubstitutoAutoridadeMaxima = function (event) {
            if (me.substitutoAutoridadeMaxima.cpf !== me.oldSubstitutoAutoridadeMaxima.cpf) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(event)).then(function() {
                    substitutoAutoridadeMaximaComboChange(event);
                }, function () {
                    me.substitutoAutoridadeMaxima = me.oldSubstitutoAutoridadeMaxima;
                });
            }
        };

        function substitutoAutoridadeHierarquicaComboChange (event) {
            if (me.colorNoUsuario(me.substitutoAutoridadeHierarquica.nome)) {
                showAvisoNoComboUsuario(me.substitutoAutoridadeHierarquica, event);
                me.substitutoAutoridadeHierarquica = null;
            } else {
                if (me.autoridadeHierarquica != null && me.substitutoAutoridadeHierarquica.cpf === me.autoridadeHierarquica.cpf) {
                    showAlertaUsuariosIguais('Substituto Autoridade Hierárquica 1ª Instância');
                    me.substitutoAutoridadeHierarquica = null;
                }
                if (me.autoridadeMaxima != null && me.substitutoAutoridadeHierarquica != null && me.substitutoAutoridadeHierarquica.cpf === me.autoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais('Substituto Autoridade Máxima 2ª Instância');
                    me.substitutoAutoridadeHierarquica = null;
                }
                if (me.substitutoAutoridadeMaxima != null && me.substitutoAutoridadeHierarquica != null && me.substitutoAutoridadeHierarquica.cpf === me.substitutoAutoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Máxima 2ª Instância');
                    me.substitutoAutoridadeHierarquica = null;
                }
            }
        }

        function substitutoAutoridadeMaximaComboChange (event) {
            if (me.colorNoUsuario(me.substitutoAutoridadeMaxima.nome)) {
                showAvisoNoComboUsuario(me.substitutoAutoridadeMaxima, event);
                me.substitutoAutoridadeMaxima = null;
            } else {
                if (me.autoridadeMaxima != null && me.autoridadeMaxima.cpf === me.substitutoAutoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais("Substituto Autoridade Máxima 2ª Instância");
                    me.substitutoAutoridadeMaxima = null;
                }
                if (me.autoridadeHierarquica != null && me.substitutoAutoridadeMaxima != null && me.substitutoAutoridadeMaxima.cpf === me.autoridadeHierarquica.cpf) {
                    me.substitutoAutoridadeMaxima = null;
                    showAlertaUsuariosIguais('Substituto Autoridade Hierárquica 1ª Instância');
                }
                if (me.substitutoAutoridadeHierarquica != null && me.substitutoAutoridadeMaxima != null && me.substitutoAutoridadeMaxima.cpf === me.substitutoAutoridadeHierarquica.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Hierárquica 1ª Instância');
                    me.substitutoAutoridadeMaxima = null;
                }
            }
        }

        me.titularAutoridadeMaximaComboChange = function (event) {
            if (me.colorNoUsuario(me.autoridadeMaxima.nome)) {
                showAvisoNoComboUsuario(me.autoridadeMaxima, event);
                me.autoridadeMaxima = null;
            } else {
                if (me.substitutoAutoridadeMaxima != null && me.autoridadeMaxima.cpf === me.substitutoAutoridadeMaxima.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Máxima 2ª Instância');
                    me.autoridadeMaxima = null;
                }
                if (me.autoridadeHierarquica != null && me.autoridadeMaxima != null && me.autoridadeMaxima.cpf === me.autoridadeHierarquica.cpf) {
                    me.autoridadeMaxima = null;
                    showAlertaUsuariosIguais('Substituto Autoridade Hierárquica 1ª Instância');
                }
                if (me.substitutoAutoridadeHierarquica != null && me.autoridadeMaxima != null && me.autoridadeMaxima.cpf === me.substitutoAutoridadeHierarquica.cpf) {
                    showAlertaUsuariosIguais('Titular Autoridade Hierárquica 1ª Instância');
                    me.autoridadeMaxima = null;
                }
                me.obterAutoridadeMaxima = true;
            }
        };

        me.adicionarSubstitutoPrimeraInstancia = function () {
            me.substitutos.primera.bool = true;
        };

        me.adicionarSubstitutoSegundaInstancia = function () {
            me.substitutos.segunda.bool = true;
        };

        me.mudarEstadoUnidade = function (ev) {
            if (!me.unidadeEstado) {
                ativarInativarUnidade(ev);
            }
            else {
                ai();
            }
        };

        me.removeSubstitutoPrimeraInstancia = function (ev) {
            if (me.substitutoAutoridadeHierarquica != null && me.substitutoAutoridadeHierarquica.hasOwnProperty("cpf")) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(ev)).then(function() {
                    me.substitutoAutoridadeHierarquica = null;
                    me.substitutos.primera.bool = false;
                });
            } else {
                me.substitutos.primera.bool = false;
            }
        };

        me.removeSubstitutoSegundaInstancia = function (ev) {
            if (me.substitutoAutoridadeMaxima != null && me.substitutoAutoridadeMaxima.hasOwnProperty("cpf")) {
                $mdDialog.show(mensagemDesejaRemoverEssaAutoridade(ev)).then(function() {
                    me.substitutoAutoridadeMaxima = null;
                    me.substitutos.segunda.bool = false;
                });
            } else {
                me.substitutos.segunda.bool = false;
            }
        };

        me.isValid = function (ev) {
            if (validityFields()) {
                var titulo = "Deseja continuar?",
                    mensagem = "A alteração dos dados de responsável por recurso de 3ª e 4ª instância será aplicada para todas as Unidades e Subunidades cadastradas no sistema";

                if (me.responsavelRecursoQuartaInstancia !== me.responsavelRecursoQuartaInstanciaTemp || me.responsavelRecursoTerceiraInstancia !== me.responsavelRecursoTerceiraInstanciaTemp) {
                    $mdDialog.show(MensagensService.dialogoConfirmacao(titulo, mensagem, ev)).then(function() {
                        trocarUsuario("ALTERAR");
                    }, function () {
                        me.responsavelRecursoQuartaInstancia = me.responsavelRecursoQuartaInstanciaTemp;
                        me.responsavelRecursoTerceiraInstancia = me.responsavelRecursoTerceiraInstanciaTemp;
                        trocarUsuario("MANTENER");
                    });
                }
                else {
                    trocarUsuario(me.responsavelRecursoAcao);
                }
            }
        };

        me.trocarTitularHir = function () {
            me.temp.bool.autoridade.hier = true;
        };

        me.trocarSubstitutoHir = function () {
            me.temp.bool.autoridade.hier = false;
        };

        me.trocarTitularMax = function () {
            me.temp.bool.autoridade.maxi = true;
        };

        me.trocarSubstitutoMax = function () {
            me.temp.bool.autoridade.maxi = false;
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

        me.voltar = function () {
            $state.go("consultarUnidade");
        };

        // Implementação de metodos privados ---------------------------------------------------------------------------

        function ativarInativarUnidade (ev) {
            var titulo = "Deseja continuar?",
                mensagem = "Caso esta Unidade/Subunidade seja inativada, todos os usuário vinculados à ela serão desvinculados";

            $mdDialog.show(MensagensService.dialogoConfirmacao(titulo, mensagem, ev)).then(function() {
                ai();
            }, function() {
                me.unidadeEstado = !me.unidadeEstado;
            });
        }

        function ai() {
            UnidadeService.ativarDesativarUnidade(me.defaultUnidade.id, me.unidadeEstado).then(function() {
                MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                me.disabledForm = !me.unidadeEstado;
            });
        }

        // true = [lista], false = {object}.
        function curarNomeUsuario (usuario, usuarioList, bool) {
            var unidadeName = me.defaultUnidade.nomeUnidade.toUpperCase();
            //
            function clearNomeUnidade(usr) {
                if (usr.includes(unidadeName)) {
                    var nomeUser = usr.replace("Usuário atribuído à unidade:", "");
                    // Replace all.
                    nomeUser = nomeUser.replace("[", "");
                    nomeUser = nomeUser.replace("]", "");
                    nomeUser = nomeUser.replace(unidadeName, "");
                    // return sem space.
                    return nomeUser.trim();
                }
                return usr;
            }
            // Curar Lista. [].
            if (bool) {
                var userList = [];
                usuarioList.forEach(function (usr) {
                    usr.nome = clearNomeUnidade(usr.nome);
                    userList.push(usr);
                });
                return userList;
            }
            else { // Curar objeto. {}.
                if (usuario !== null) {
                    usuario.nome = clearNomeUnidade(usuario.nome);
                } else {
                    usuario = null;
                }
                return usuario;
            }
        }

        function mensagemDesejaRemoverEssaAutoridade(ev) {
            var titulo = "Deseja remover essa autoridade?",
                mensagem = "A remoção dessa autoridade irá desvincular a mesma da sua unidade.";
            return MensagensService.dialogoConfirmacao(titulo, mensagem, ev);
        }

        function showAlertaUsuariosIguais (tipo) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Usuário já selecionado')
                    .textContent('O usuário já está selecionado como: '+ trocarTipoUsuario(tipo))
                    .ok('Ok')
                    .targetEvent(event)
            );
        }

        function trocarTipoUsuario(tipo) {
            var texto = "";
            if (tipo === 'Titular Autoridade Hierárquica 1ª Instância') {
                texto = 'Substituto Autoridade Hierárquica 1ª Instância'
            }
            else if (tipo === 'Substituto Autoridade Hierárquica 1ª Instância') {
                texto = 'Titular Autoridade Hierárquica 1ª Instância';
            }
            else if (tipo === 'Titular Autoridade Máxima 2ª Instância') {
                texto = 'Substituto Autoridade Máxima 2ª Instância';
            }
            else {
                texto = 'Titular Autoridade Máxima 2ª Instância';
            }
            return texto;
        }

        function validityFields () {
            var bool = true;
            angular.forEach(me.editarUnidadeForm, function (field, name) {
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

        function trocarUsuario (responsavel) {
            var autoridadeMaxima = me.autoridadeMaxima,
                autoridadeHierarquica = me.autoridadeHierarquica,
                substitutoAutoridadeMaxima = me.substitutoAutoridadeMaxima,
                substitutoAutoridadeHierarquica = me.substitutoAutoridadeHierarquica;

            if (me.temp.bool.autoridade.hier) {
                me.autoridadeHierarquica = autoridadeHierarquica;
                me.substitutoAutoridadeHierarquica = substitutoAutoridadeHierarquica;
            } else {
                me.autoridadeHierarquica = substitutoAutoridadeHierarquica;
                me.substitutoAutoridadeHierarquica = autoridadeHierarquica;
            }

            if (me.temp.bool.autoridade.maxi) {
                me.autoridadeMaxima = autoridadeMaxima;
                me.substitutoAutoridadeMaxima = substitutoAutoridadeMaxima;
            } else {
                me.autoridadeMaxima = substitutoAutoridadeMaxima;
                me.substitutoAutoridadeMaxima = autoridadeMaxima;
            }
            me.defaultUnidade.subunidade = me.defaultSubunidade;
            editar(responsavel);
        }

        function editar (responsavel) {
            var dados = {
                orgao: me.defaultOrgao,
                unidade: me.defaultUnidade,
                usuarioAutoridadeHierarquica: me.autoridadeHierarquica,
                substitutoAutoridadeHierarquica: me.substitutoAutoridadeHierarquica,
                usuarioAutoridadeMaxima: me.autoridadeMaxima,
                substitutoAutoridadeMaxima: me.substitutoAutoridadeMaxima,
                responsavelRecurso: {
                    responsavelRecursoAcao: responsavel,
                    responsavelRecursoTerceiraInstancia: me.responsavelRecursoTerceiraInstancia,
                    responsavelRecursoQuartaInstancia: me.responsavelRecursoQuartaInstancia
                }
            };
            UnidadeService.editar(dados).then(function() {
                MensagensService.exibirMensagemSucesso("Dados salvos com sucesso.");
                me.voltar();
            });
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

        function init () {
            if (me.substitutoAutoridadeMaxima != null) {
                me.substitutos.segunda.bool = true;
            }
            if (me.substitutoAutoridadeHierarquica != null) {
                me.substitutos.primera.bool = true;
            }
        }

        // Inicialização da controller----------------------------------------------------------------------------------
        init();
    }
})();
