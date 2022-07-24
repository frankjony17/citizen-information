
var EndPointPage = function () {
    /**COMBOBOX */
    this.comboOpcoes = element(by.model('tipo'));
    this.opcaoEndpoint = element(by.css('[ng-value="3"]'));

    /**ABA ENDPOINT */
    this.nomeEndPoint = element(by.model('endpoint.noEndpoint'));
    this.url = element(by.model('endpoint.noUrlEndpoint'));
    this.descricao = element(by.model('endpoint.dsEndpoint'));
    this.atributoIdentificacao = element(by.model('endpoint.noAttrId'));
    this.atributoTitulo = element(by.model('endpoint.noAttrTitle'));

    this.parametro = element(by.model('parametro.noParametro'));
    this.comboTipoParametro = element(by.model('parametro.coTipoParametro'));
    this.tipo = element.all(by.repeater('tipo in tiposParametro').row(0));
    this.expressaoRegular = element(by.model('parametro.noRegex'));

    this.btn_gravar = element(by.buttonText('GRAVAR'));
    this.btnCancelar = element(by.buttonText('CANCELAR'));

    /**Mensagens */
    this.popUpMensagem = element(by.css('.md-dialog-content > div > p '));
    this.EndpointBreadcrumbLabel = element.all(by.css('[ng-bind-html="step.ncyBreadcrumbLabel"]')).get(2);

    EndPointPage.prototype.waitUrl = function () {
        var expectedCondition = protractor.ExpectedConditions;
        browser.wait(expectedCondition.urlContains('http://spunet-geovisualizador.tst.basis.com.br'), 60000);
    }

    EndPointPage.prototype.ir = function (url) {
        browser.driver.get(url);
    }

    EndPointPage.prototype.selecionarOpcaoEndpoint = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.id('select_4'))), 10000);
        this.comboOpcoes.click();
        this.espera(1);
        this.opcaoEndpoint.click();
    }

    EndPointPage.prototype.informarDadosEndpoint = function (dados) {
        this.espera(1.5);
        this.nomeEndPoint.sendKeys(dados.nomeEndpoint);
        this.url.sendKeys(dados.url);
        this.descricao.sendKeys(dados.descricao);
        this.atributoIdentificacao.sendKeys(dados.atributoIdentificacao);
        this.atributoTitulo.sendKeys(dados.atributoTitulo);
    }

    EndPointPage.prototype.informarParametros = function (dados) {
        this.espera(2);
        this.parametro.sendKeys(dados.parametros.nome);
        this.comboTipoParametro.click();
        this.espera(1.5);
        this.tipo.click();
        this.expressaoRegular.sendKeys(dados.parametros.expressao);
    }

    EndPointPage.prototype.esprarCaixaDialogo = function () {
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('.md-dialog-content'))), 10000);
    }

    EndPointPage.prototype.gravarDados = function () {
        this.espera(1.5);
        this.btn_gravar.click();
    }

    EndPointPage.prototype.espera = function (segundos) {
        var miliSegundos = segundos * 1000;
        browser.sleep(miliSegundos);
    }

    EndPointPage.prototype.recarregar = function () {
        browser.driver.navigate().refresh();
    }
}
module.exports = EndPointPage;