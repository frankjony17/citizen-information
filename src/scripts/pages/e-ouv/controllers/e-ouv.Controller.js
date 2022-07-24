(function () {
    'use strict';

    angular.module('sdsicApp').controller('E-ouvController',['$stateParams','$mdDialog', 'SolicitacaoInformacaoService','CategoriaService', 'SubCategoriaService','EouvService','TipoManifestacaoService','$state', 'EscopoCompartilhadoPedidoDuplicadoService', 'MensagensService', controller]);

    function controller ($stateParams, $mdDialog, SolicitacaoInformacaoService, CategoriaService, SubCategoriaService, EouvService, TipoManifestacaoService,$state, EscopoCompartilhadoPedidoDuplicadoService, MensagensService) {

        var vm = this;
        /*vm.listaPalavrasChaves = [];*/
        vm.listaSubCategoria = [];
        vm.listaCategoria = [];
        vm.listaTipoManifestacao = [];
        vm.categoria = null;
        vm.subcategoria= null;
        vm.idPedido = $stateParams.idPedido;
        vm.eouv = {
            id: undefined,
            idPedido:undefined,
            tipoTratamento: {},
            tipoManifestacao: {},
            categoria: {},
            subcategoria: {},
            palavraChave: [],
            assinou: undefined,
            restricaoConteudo: undefined
        };
        vm.palavraChave = null;
        vm.tipoManifestacao = null;
        vm.restricaoConteudo = null;
        vm.responsavelResposta = 'Cargo do Usuario';
        vm.destinatarioRecursoPrimeiraInstancia = 'Nome do Destinatário';
        vm.tipoTratamento = {
            id:5,
            nome: 'Encaminhada para o E-OUV'
        };
        vm.downloadAnexo = _downloadAnexo;

        function init() {
            vm.buscarPalavrasChaves();
            carregarTodasCategorias();
            buscarPedido();
            vm.carregarTipoManifestacao();
        }

        vm.buscarSubCategorias = function() {
            SubCategoriaService.buscarPorCategoria(vm.eouv.categoria.id).then(
                function (sucessResponse) {
                    vm.listaSubCategoria = sucessResponse.data.resultado;
                })
        };

        function carregarTodasCategorias() {
            CategoriaService.buscarTodasCategorias().then(
                function (sucessResponse) {
                    vm.listaCategoria = sucessResponse.data.resultado;
                }
            );

        }

        function buscarPedido() {
            SolicitacaoInformacaoService.consultarPedidoDetalhado(vm.idPedido).then(
                function (response) {
                    vm.eouv.pedido = response.data;
                    //Modificar depois
                    vm.eouv.pedido.id = vm.idPedido;
                }
            );
        }

        function _downloadAnexo(nome) {
            SolicitacaoInformacaoService.downloadAnexo(vm.eouv.pedido.protocolo, nome).then(
                function (successResponse) {
                    var arquivoBase64 = 'data:application/vnd.ms-exce;base64,' + successResponse.data.arquivoBase64;
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = arquivoBase64;
                        link.download = nome;

                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);

                        //simulate click
                        link.click();

                        //remove the link when done
                        document.body.removeChild(link);
                    } else {
                        window.open(arquivoBase64);
                    }
                },
                function (errorResponse) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Ocorreu um erro não esperado ao fazer o download do arquivo.")
                            .hideDelay(3000)
                    );
                    $log.log(errorResponse);
                }
            );
        }

        vm.salvarStatus = function() {
            if(vm.eouvForm.$valid){
                Service.salvarStatus(vm.eouv).then(
                    function (response) {
                        vm.salvarNovoStatus = response.data.resultado;
                        MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                        vm.voltarDetalhar();
                    }
                );
            }else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.eouvForm.$setSubmitted();
            }
        };

        vm.carregarTipoManifestacao = function (){
            TipoManifestacaoService.buscarNomeTipoManifestacao().then(
                function (response) {
                    vm.listaTipoManifestacao = response.data.resultado;
                }
            )
        };

        vm.consultarDadosSolicitante = function () {
            $state.go("dadosSolicitante", {idPedido: vm.idPedido});
        };

        vm.voltarDetalhar = function () {
            EscopoCompartilhadoPedidoDuplicadoService.setPagina("");
            $state.go("detalheSolicitacaoInformacao", {idPedido: vm.idPedido});
        };

        vm.limparEscopo = function(){
            vm.eouv = {};
        };

        vm.voltarConsultaPedidoInformacao = function () {
            $state.go("solicitacaoInformacao");
        };

        vm.buscarPalavrasChaves = function() {
            EouvService.buscarPalavraChave(vm.idPedido).then(
                function (response) {
                    vm.listaPalavrasChaves = response.data;
                })
        };

        vm.enviarEouv = function(ev) {
            if(vm.eouvForm.$valid){
                vm.eouv.idPedido = vm.idPedido;
                if(vm.eouv.pedido.perfilUsuario != 'FKSOLUTIONS.TECNICO'){
                    vm.eouv.assinou = true;
                    $mdDialog.show({
                        templateUrl: 'scripts/pages/e-ouv/view/eouv-dialog.tmpl.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true,
                        fullscreen: vm.customFullscreen, // Only for -xs, -sm breakpoints.
                        locals: {
                            eouv: vm.eouv,
                            responsavelResposta: vm.responsavelResposta,
                            destinatarioRecursoPrimeiraInstancia: vm.destinatarioRecursoPrimeiraInstancia
                        },
                        controller:['$scope', 'eouv', 'responsavelResposta', 'destinatarioRecursoPrimeiraInstancia', function ($scope, eouv, responsavelResposta, destinatarioRecursoPrimeiraInstancia) {
                            $scope.responsavelResposta = responsavelResposta;
                            $scope.destinatarioRecursoPrimeiraInstancia = destinatarioRecursoPrimeiraInstancia;
                            $scope.salvarStatus = function () {
                                vm.eouv.pedido = null;
                                EouvService.salvarStatus(eouv).then(
                                    function (response) {
                                        $mdDialog.hide(response.data.resultado);
                                    }
                                );

                            };

                            $scope.cancelar = function () {
                                $mdDialog.cancel();
                            }

                        }]


                    })
                        .then(function(response) {
                            MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                            vm.salvarNovoStatus = response;
                            vm.voltarConsultaPedidoInformacao();
                        });
                }else{
                    vm.eouv.assinou = false;
                    vm.eouv.pedido = null;
                    EouvService.salvarStatus(vm.eouv).then(
                        function(response) {
                            MensagensService.exibirMensagemSucesso("Dados enviados com sucesso.");
                            vm.salvarNovoStatus = response;
                            vm.voltarConsultaPedidoInformacao();
                        }
                    )
                }

            }else {
                MensagensService.exibirMensagemCamposObrigatorios();
                vm.eouvForm.$setSubmitted();
            }
        };

        init();
    }

})();
