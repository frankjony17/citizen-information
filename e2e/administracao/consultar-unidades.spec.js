const ConsultarUnidadesPage = require('./consultar-unidades.po');
const AbrirPage = require('../abrirPage.po');

describe('Consultar Unidades', function () {
    const page = new ConsultarUnidadesPage();
    const abrirPage = new AbrirPage();


    it('Consultar Unidades', function () {
        browser.driver.get('http://sdsic.basis.com.br/#/consultarUnidade');
        page.espera(2);
        page.selecionaUnidade();
        page.selecionaSubUnidade();
        page.buscar();
        expect(page.listaTabela.rowCount >= 0);
    });

    it('Cadastrar Unidade', function () {
        page.irParaCadastro();
        page.espera(2);
        page.selecionaUnidadeCadastro();
        page.selecionaSubUnidadeCadastro();
        page.espera(1);
        page.salvar();
        expect(page.alertaSalvoComSucesso);
    });
});
