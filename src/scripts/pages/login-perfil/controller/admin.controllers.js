(function () {
    'use strict';
    angular.module('sdsicApp').controller("AdminController", ['$state', '$http', 'MensagensService', controller]);
        function controller($state, $http, MensagensService) {
            var
            me = this, URL_FKSOLUTIONS = 'sdsic/api',
            alerta = {
                id: null,
                alerta: null
            };

            function load() {
                $http.get(URL_FKSOLUTIONS + "/usuario/alerta/load").then(function (response) {
                    me.alerta = response.data;
                    if (me.alerta.alerta != null) {
                        CKEDITOR.instances.editor1.setData(me.alerta.alerta);
                    }
                    else {
                        CKEDITOR.instances.editor1.setData(
                            "<p><h2>"+
                            "Caro usuário, você não possui unidade vinculada.<br>"+
                            "Entre em contato com o responsável pela sua Unidade ou com o Administrador do sistema.</h2></p>"
                        );
                    }
                }, function (response) {
                   console.log("Erro: AdminController->load() ", response);
                });
            }

            load();

            me.salvar = function () {
                if (CKEDITOR.instances.editor1.getData() !== "") {
                    alerta.id = me.alerta.id;
                    alerta.alerta = CKEDITOR.instances.editor1.getData();
                    $http.put(URL_FKSOLUTIONS + "/usuario/alerta/editar", alerta).then(function() {
                        MensagensService.exibirMensagemSucesso("Dados gravados com sucesso.");
                        $state.go("admin");
                    }, function (response) {
                        console.log("Erro: AdminController->salvar() ", response);
                    });
                }
                else {
                    MensagensService.exibirMensagemCamposObrigatorios();
                }
            };

            me.voltar = function () {
                $state.go("admin");
            };
        }
})();
