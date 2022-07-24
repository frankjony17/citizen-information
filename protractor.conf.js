'use strict';

// An example configuration file.
exports.config = {
    framework: 'jasmine',
    useAllAngular2AppRoots: true,
    specs: ['./*/*/*.e2e-spec.js'],
    getPageTimeout: 45000,
    jasmineNodeOpts: {
        defaultTimeoutInterval: 45000,
        showColors:true
    },
    capabilities: {
        'browserName': 'chrome'

    },

    suites: {
        sdsic: 'e2e/administracao/consultar-unidades.spec.js',
        sdsic2:'e2e/administracao/consultar-glossario.spec.js'

    },

    onPrepare: function () {
        browser.driver.manage().window().maximize();
        //abre login
        browser.driver.get('http://localhost:3000/');
        browser.wait(protractor.ExpectedConditions.invisibilityOf(element(by.id('loading-bar'))), 5000);
        browser.waitForAngularEnabled(false);
        //insere informações no campo de login
        browser.driver.wait(protractor.ExpectedConditions.presenceOf(element(by.css('#idToken1'))),15000);
        browser.driver.findElement(by.css('#idToken1')).sendKeys('61914509153');
        browser.driver.findElement(by.css('#idToken2')).sendKeys('123456789');
        browser.driver.findElement(by.css('#loginButton_0')).click();
        browser.sleep( 5000 );
        browser.driver.get('http://sdsic.basis.com.br/#/');
        return browser.wait(protractor.ExpectedConditions.presenceOf(element(by.id('breadcrumb'))), 20000);
    }

};
