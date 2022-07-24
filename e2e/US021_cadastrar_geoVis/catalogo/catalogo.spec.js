const CatalogoPage = require('./catalogo.po');
const MassaTeste = require('./massa-teste.json');

describe('US021-Cadastrar GeoVis Admin - Catálogo', function () {

    const page = new CatalogoPage();

    beforeAll(function () {
        page.waitUrl();
        page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/cadastrar');
    });

    fit('URL catálogo inválida', function () {
        page.selecionarOpcaoCatalogo();
        page.informarDadosCatalogo(MassaTeste.catalogoUrlInvalida);
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('URL Inválido');
        page.espera(2);
    });

    it('URL catálogo já cadastrada', function () {
        page.recarregar();
        page.selecionarOpcaoCatalogo();
        page.informarDadosCatalogo(MassaTeste.catalogoJaCadastrada);
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('URL duplicada');
        page.espera(2);
    });

    it('Válida recuperação dados catálogo', function () {
        page.recarregar();
        page.selecionarOpcaoCatalogo();
        page.informarDadosCatalogo(MassaTeste.calogoValido);
        page.waitBtnGravar();
        page.informarDadosResponsavel(MassaTeste.calogoValido);
        expect(page.tabela.isDisplayed()).toBeTruthy();
        page.espera(2);
    });

    it('Catálogo cadastrado com sucesso', function () {
        page.recarregar();
        page.selecionarOpcaoCatalogo();
        page.informarDadosCatalogo(MassaTeste.calogoValido);
        page.waitBtnGravar();
        page.informarDadosResponsavel(MassaTeste.calogoValido);
        page.gravarDados();
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('Cadastro realizado com sucesso!');
        page.espera(10);
    });

    it('Alterar Catálogo', function () {
        page.recarregar();
        page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/catalogo/editar/4');
        page.gravarDados();
        page.esprarCaixaDialogo();
        expect(page.popUpMensagem.getText()).toEqual('Alterado com sucesso!');
        page.espera(2);
    });

});