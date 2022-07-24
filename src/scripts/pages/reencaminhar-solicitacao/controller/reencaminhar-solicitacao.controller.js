(function () {

    'use strict';
    angular.module('sdsicApp').controller('ReencaminharSolicitacaoController',['$state','$stateParams','SolicitacaoInformacaoService','MensagensService','ReencaminharSolicitacaoService','OrgaoService', 'EscopoCompartilhadoPedidoDuplicadoService', controller]);
    function controller($state,$stateParams, SolicitacaoInformacaoService,MensagensService,reencaminharSolicitacaoService, orgaoService, EscopoCompartilhadoPedidoDuplicadoService) {

        var vm = this;

        vm.idPedido = $stateParams.idPedido;
        vm.fluxo = $stateParams.fluxo;
        vm.orgao = {};
        vm.reencaminharSolicitacao = {};

        if (vm.fluxo == "reencaminhar") {
            vm.reencaminharSolicitacao = {
                notificacaoEnviadaSolicitante : 'Senhor(a),' +
                    '\n ' +
                    '\n O Serviço de Informações ao Cidadão do Ministério do planejamento, Desenvolvimento e Gestão ' +
                    '\n agradece o seu contato. e' +
                    '\n' +
                    '\n Informamos o reencaminhamento automático (pelo sistema e-SIC) do pedido ao [informar órgão],' +
                    '\n pois o assunto em tela se relaciona às atribuições daquele órgão.' +
                    '\n' +
                    '\n Atenciosamente,',
                notificacaoEnviadaDestinatario : 'Prezados,' +
                    '\n' +
                    '\n Informamos o reencaminhamento automático(pelo sistema e-SIC) do pedido, pois o assunto em tela se ' +
                    '\n relaciona às atribuições [incluir nome do órgão].' +
                    '\n' +
                    '\n Atenciosamente,'
            };
        }

        function init () {
                buscarPedido();
                vm.buscarReencaminhamentoParaOrgao();

        }

        function buscarPedido() {
            SolicitacaoInformacaoService.consultarPedidoDetalhado(vm.idPedido).then(
                function (response) {
                    vm.reencaminharSolicitacao.pedido = response.data;
                    //Modificar depois
                    vm.reencaminharSolicitacao.pedido.id = vm.idPedido;
                }
            );
        }

        vm.buscarReencaminhamentoParaOrgao = function () {
            reencaminharSolicitacaoService.buscarReencaminhamentoParaOrgao(vm.idPedido).then(
                function(successResponse) {
                    if(successResponse.data.id != null){
                        vm.reencaminharSolicitacao = successResponse.data;
                        vm.buscarTodosOrgaos();
                    }else{
                        vm.buscarTodosOrgaos();
                    }


                }

        );

        };

        vm.buscarTodosOrgaos = function () {
            orgaoService.buscarOrgao().then(
                function (response) {
                    vm.listaOrgao = response.data.resultado;
                    if(vm.reencaminharSolicitacao.orgao != null){
                        for(var a =0;  a < vm.listaOrgao.length; a++){
                            if(vm.listaOrgao[a].descricao === vm.reencaminharSolicitacao.orgao.descricao){
                                vm.orgao = vm.listaOrgao[a];
                            }
                        }
                    }
                }
            );

        };

        vm.salvarReencaminhar = function() {
            if(vm.reencaminharForm.$valid){
                vm.reencaminharSolicitacao.pedido = null;
                vm.reencaminharSolicitacao.idPedido = vm.idPedido;
                vm.reencaminharSolicitacao.orgao = vm.orgao;
                reencaminharSolicitacaoService.salvarReencaminharSolicitacao(vm.reencaminharSolicitacao).then(
                    function (response) {
                        vm.salvar = response.data.resultado;
                        MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                        vm.voltarConsultaPedidoInformacao();
                    }
                );
            }else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.reencaminharForm.$setSubmitted();
            }
        };

        vm.consultarDadosSolicitante = function () {
            $state.go("dadosSolicitante", {idPedido: vm.idPedido});
        };

        vm.voltarConsultaPedidoInformacao = function () {
            $state.go("solicitacaoInformacao");
        };

        vm.voltarDetalhar = function () {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        };

        init();

    }

})();
