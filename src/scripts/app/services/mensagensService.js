(function () {
    "use strict";
    angular.module("sdsicApp").factory("MensagensService", mensagensService);

    function mensagensService($mdToast, $mdDialog) {

        var TEMAS = {
            ERRO: "error-toast",
            SUCESSO: "success-toast"
        };

        var MENSAGENS = {
            CAMPOS_OBRIGATORIOS: "Dados obrigatórios não preenchidos",
            CAMPOS_OBRIGATORIOS2: "Dados obrigatórios não preenchidos, você deve incluir dados na tabela",
            CARACTERES_MINIMOS: "O campo deve possuir no mínimo 30 caracteres",
            CARACTERES_MINIMOS2: "O campo deve possuir no mínimo 80 caracteres",
            CARACTERES_MAXIMOS: "O campo deve possuir no máximo 2048 caracteres",
            CARACTERES_MAXIMOS_PEDIDO_DUPLICADO: "O campo deve possuir no máximo 70 caracteres",
            SUBASSUNTO_DUPLICADO: "O Subassunto já existe",
            CLASSIFICACAO_DUPLICADO: "O Classificação já existe",
            PALAVRACHAVE_DUPLICADO: "A palavra-chave já existe"

        };

        function exibirMensagem(msg, tema) {
            $mdToast.show(
                $mdToast.simple()
                    .content(msg)
                    .theme(tema)
                    .position('top right')
                    .hideDelay(3000)
            );
        }

        function dialogoAlerta (titulo, mensagem) {
            $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title(titulo).textContent(mensagem).ok('Ok').targetEvent(event));
        }

        function dialogoConfirmacao (titulo, mensagem, ev) {
            return $mdDialog.confirm().title(titulo).textContent(mensagem).targetEvent(ev).ok('Sim').cancel('Não');
        }

        function mensagemErro(msg) {
            exibirMensagem(msg, TEMAS.ERRO);
        }

        function mensagemSucesso(msg) {
            exibirMensagem(msg, TEMAS.SUCESSO);
        }

        function mensagemCamposObrigatorios() {
            exibirMensagem(MENSAGENS.CAMPOS_OBRIGATORIOS, TEMAS.ERRO);
        }

        function mensagemCamposObrigatorios2() {
            exibirMensagem(MENSAGENS.CAMPOS_OBRIGATORIOS2, TEMAS.ERRO);
        }

        function mensagemSubAssuntoDuplicado() {
            exibirMensagem(MENSAGENS.SUBASSUNTO_DUPLICADO, TEMAS.ERRO);
        }

        function mensagemClassificacaoDuplicado() {
            exibirMensagem(MENSAGENS.CLASSIFICACAO_DUPLICADO, TEMAS.ERRO);
        }

        function mensagemPalavraChaveDuplicado() {
            exibirMensagem(MENSAGENS.PALAVRACHAVE_DUPLICADO, TEMAS.ERRO);
        }

        function  exibirmensagemQuantidadeCaracteres() {
            exibirMensagem(MENSAGENS.CARACTERES_MINIMOS,TEMAS.ERRO);
        }
        function  exibirmensagemQuantidadeCaracteres2() {
            exibirMensagem(MENSAGENS.CARACTERES_MINIMOS2,TEMAS.ERRO);
        }
        function exibirmensagemQuantidadeMaximaCaracteres() {
            exibirMensagem(MENSAGENS.CARACTERES_MAXIMOS,TEMAS.ERRO);
        }
        function exibirMensagemQuantidadeMaximaCaracteresPedidoDuplicado() {
            exibirMensagem(MENSAGENS.CARACTERES_MAXIMOS_PEDIDO_DUPLICADO, TEMAS.ERRO);
        }

        function validityFields (form) {
            var bool = true;
            angular.forEach(form, function (field, name) {
                if (!name.startsWith('$')) {
                    console.log(name);
                    console.log(field.$valid);
                    if (!field.$valid) {
                        field.$setTouched();
                        mensagemCamposObrigatorios();
                        bool = false;
                    }
                }
            });
            return bool;
        }

        return {
            exibirMensagemErro: mensagemErro,
            exibirMensagemSucesso: mensagemSucesso,
            exibirMensagemCamposObrigatorios: mensagemCamposObrigatorios,
            exibirMensagemCamposObrigatorios2: mensagemCamposObrigatorios2,
            exibirmensagemQuantidadeCaracteres: exibirmensagemQuantidadeCaracteres,
            exibirmensagemQuantidadeCaracteres2: exibirmensagemQuantidadeCaracteres2,
            exibirmensagemQuantidadeMaximaCaracteres: exibirmensagemQuantidadeMaximaCaracteres,
            exibirMensagemQuantidadeMaximaCaracteresPedidoDuplicado: exibirMensagemQuantidadeMaximaCaracteresPedidoDuplicado,
            mensagemSubAssuntoDuplicado: mensagemSubAssuntoDuplicado,
            mensagemPalavraChaveDuplicado: mensagemPalavraChaveDuplicado,
            mensagemClassificacaoDuplicado: mensagemClassificacaoDuplicado,
            dialogoAlerta: dialogoAlerta,
            dialogoConfirmacao: dialogoConfirmacao,
            validityFields: validityFields
        };
    }
})();

