const EndPointPage = require('./endpoint.po');
const MassaTeste = require('./massa-teste.json');

describe('US021-Cadastrar GeoVis Admin - Endpoint', function () {

    const page = new EndPointPage();

    beforeAll(function () {
        page.waitUrl();
        page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/cadastrar');
    });

    it('Cadastrar Endpoint', function () {
        page.selecionarOpcaoEndpoint();
        page.informarDadosEndpoint(MassaTeste.calogoValido);
        page.informarParametros(MassaTeste.calogoValido);
        page.gravarDados();
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('Cadastro realizado com sucesso!');
        page.espera(2);
    });

    it('Visualizar Endpoint', function () {
        page.recarregar();
        page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/endpoint/1');
        expect(page.EndpointBreadcrumbLabel.getText()).toEqual('VISUALIZAR ENDPOINT');
        page.espera(2);
    });

    it('Editar Endpoint', function () {
        page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/endpoint/editar/10');
        page.gravarDados();
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('Alterado com sucesso!');
        page.espera(2);
    });

});