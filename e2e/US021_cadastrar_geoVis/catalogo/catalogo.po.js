
var CatalogoPage = function () {

    /**COMBOBOX */
    this.comboOpcoes = element(by.model('tipo'));
    this.opcaoCatalogo = element(by.id('select_option_2'));

    /**ABA CATALOGO */
    this.nomeCatalogo = element(by.model('catalogo.noCatalogo'));
    this.urlCatalogo = element(by.model('catalogo.noUrlCatalogo'));
    this.descricaoCatalogo = element(by.model('catalogo.dsCatalogo'));
    this.nomeResponsavelCatalogo = element(by.model('catalogo.noInstituicao'));
    this.telefoneResponsavelCatalogo = element(by.model('catalogo.noContato'));
    this.emailResponsavelCatalogo = element(by.model('catalogo.noEmail'));

    this.tabela = element(by.tagName('md-table-container'));
    this.btn_gravar = element(by.buttonText('GRAVAR'));
    this.btnCancelar = element(by.buttonText('CANCELAR'));

    /**Mensagens */
    this.popUpMensagem = element(by.css('.md-dialog-content > div > p '));

    CatalogoPage.prototype.waitUrl = function () {
        var expectedCondition = protractor.ExpectedConditions;
        browser.wait(expectedCondition.urlContains('http://spunet-geovisualizador.tst.basis.com.br'), 60000);
    }

    CatalogoPage.prototype.ir = function (url) {
        browser.driver.get(url);
    }

    CatalogoPage.prototype.selecionarOpcaoCatalogo = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('select_4'))), 10000);
        this.comboOpcoes.click();
        this.espera(1);
        this.opcaoCatalogo.click();
    }

    CatalogoPage.prototype.esprarCaixaDialogo = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.md-dialog-content'))), 25000);
    }

    CatalogoPage.prototype.waitBtnGravar = function () {
        var condicao = protractor.ExpectedConditions;
        browser.wait(condicao.elementToBeClickable(this.btn_gravar), 60000);
    }

    CatalogoPage.prototype.informarDadosCatalogo = function (dados) {
        this.espera(1.5);
        this.nomeCatalogo.sendKeys(dados.nomeCatalogo);
        this.urlCatalogo.sendKeys(dados.url);
        this.descricaoCatalogo.sendKeys(dados.descricao);
    }

    CatalogoPage.prototype.informarDadosResponsavel = function (dados) {
        this.espera(1.5);
        this.nomeResponsavelCatalogo.sendKeys(dados.nomeReposanvel);
        this.telefoneResponsavelCatalogo.sendKeys(dados.telefone);
        this.emailResponsavelCatalogo.sendKeys(dados.email);
    }

    CatalogoPage.prototype.gravarDados = function () {
        this.espera(1.5);
        this.btn_gravar.click();
    }

    CatalogoPage.prototype.espera = function (segundos) {
        var miliSegundos = segundos * 1000;
        browser.sleep(miliSegundos);
    }

    CatalogoPage.prototype.recarregar = function () {
        browser.driver.navigate().refresh();
    }
}
module.exports = CatalogoPage;