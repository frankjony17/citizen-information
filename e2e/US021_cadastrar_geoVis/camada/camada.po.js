
var CamadaPage = function () {

    /**COMBOBOX */
    this.comboOpcoes = element(by.model('tipo'));
    this.opcaoCamada = element(by.id('select_option_1'));
    this.opcaoCatalogo = element(by.id('select_option_2'))
    this.opcaoEndPoint = element(by.id('select_option_3'))

    /**ABA CAMADA */
    this.nomeInstituicao = element(by.name('noInstituicao'));
    this.nomeCamada = element(by.model('camada.noLayer'));
    this.url = element(by.name('noUrlCamada'));
    this.formato = element(by.model('camada.coFormato'));
    this.formatoWMS = element.all(by.repeater('ft in formatos').row(1));
    this.descricao = element(by.name('dsCamada'));
    this.projecao = element(by.model('camada.noProjecao'));
    this.projecaoUm = element.all(by.repeater('proj in projecoes').row(0));

    this.nome = element(by.model('camada.noResponsavel'));
    this.telefone = element(by.model('camada.telResponsavel'));
    this.email = element(by.model('camada.noEmailResponsavel'));

    this.btn_gravar = element(by.buttonText('GRAVAR'));
    this.btnCancelar = element(by.buttonText('CANCELAR'));

    /**Mensagens */
    this.popUpMensagem = element(by.css('.md-dialog-content > div > p '));

    CamadaPage.prototype.waitUrl = function () {
        var expectedCondition = protractor.ExpectedConditions;
        browser.wait(expectedCondition.urlContains('http://spunet-geovisualizador.tst.basis.com.br'), 15000);
    }

    CamadaPage.prototype.ir = function (url) {
        browser.driver.get(url);
    }

    CamadaPage.prototype.selecionarOpcaoCamada = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('select_4'))), 5000);
        this.comboOpcoes.click();
        this.opcaoCamada.click();
    }

    CamadaPage.prototype.cancelar = function () {
        this.espera(1);
        this.btnCancelar.click();
    }

    CamadaPage.prototype.informarDadosCamadaParcial = function (dados) {
        this.espera(1);
        this.nomeInstituicao.sendKeys(dados.nomeInstituicao);
        this.espera(1);
        this.nomeCamada.sendKeys(dados.nomeCamada);
        this.url.sendKeys(dados.url);
        this.formato.click();
        this.espera(1);
        this.formatoWMS.click();
    }

    CamadaPage.prototype.informarDadosCamada = function (dados) {
        this.espera(1);
        this.nomeInstituicao.sendKeys(dados.nomeInstituicao);
        this.espera(1);
        this.nomeCamada.sendKeys(dados.nomeCamada);
        this.url.sendKeys(dados.url);
        this.formato.click();
        this.espera(1);
        this.formatoWMS.click();
        this.waitBtnGravar();
        this.descricao.sendKeys(dados.descricao);
        this.projecao.click();
        this.espera(1);
        this.projecaoUm.click();
    }

    CamadaPage.prototype.informarDadosResponsavel = function (dados) {
        this.nome.sendKeys(dados.nomeReposanvel);
        this.espera(1);
        this.telefone.sendKeys(dados.telefone);
        this.espera(1);
        this.email.sendKeys(dados.email);
    }

    CamadaPage.prototype.esprarCaixaDialogo = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.md-dialog-content'))), 5000);
    }

    CamadaPage.prototype.waitBtnGravar = function () {
        var condicao = protractor.ExpectedConditions;
        browser.wait(condicao.elementToBeClickable(this.btn_gravar), 60000);
    }

    CamadaPage.prototype.gravarDados = function () {
        this.espera(1.5);
        this.btn_gravar.click();
    }

    CamadaPage.prototype.espera = function (segundos) {
        var miliSegundos = segundos * 1000;
        browser.sleep(miliSegundos);
    }

    CamadaPage.prototype.recarregar = function () {
        browser.driver.navigate().refresh();
    }

}
module.exports = CamadaPage;