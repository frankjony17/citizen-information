var abrirPage = function () {
    var botaoMenu  = element(by.className('menu md-button md-ink-ripple'));
    var EC = protractor.ExpectedConditions;
    var botaoDestinacao = element.all(by.repeater('item in getMenuAcessos()')).get(3);
    var breadcrumb = element(by.className('layout-align-start-center layout-row flex-85'));
    var tituloPagina = element(by.className("titulo-verde-header ng-binding"));
    var loadingBar = element(by.id('loading-bar'));

    this.abrir = function () {
        browser.get('http://sdsic.basis.com.br/#/');
        browser.waitForAngularEnabled(false);
        browser.wait(EC.invisibilityOf(loadingBar),10000);
    };

    this.aguardarLogin = function () {
        return browser.wait(EC.presenceOf(breadcrumb), 20000);
    };

    this.abrirMenu = function () {
        browser.waitForAngularEnabled(false);
        botaoMenu.click();
        browser.wait(EC.visibilityOf(botaoDestinacao),4000);
    };
    this.abrirSubMenu = function () {
        browser.waitForAngularEnabled(false);

        botaoDestinacao.click();


    };
    this.abrirPagina = function () {
        this.abrir();
        this.abrirMenu();
        this.abrirSubMenu();

        var destinacao = element(by.linkText('Pedido'));
        browser.wait(EC.visibilityOf(destinacao),5000);
        browser.waitForAngularEnabled(false);
        browser.sleep(2000);
        destinacao.click();
        browser.wait(EC.invisibilityOf(loadingBar),5000);
    };

    this.isAberta = function () {
        return tituloPagina.isPresent();
    };

};
module.exports = abrirPage;
