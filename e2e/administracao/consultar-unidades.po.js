var ConsultarUnidadePage = function () {

    //Consultar unidades
    this.comboUnidade = element(by.id('select-unidade'));
    this.selectUnidade = element.all(by.repeater('unidade in consultarUnidadeCtrl.listaUnidade').row(0));
    this.comboSubUnidade = element(by.id('select-sub-unidade'));
    this.selectSubUnidade = element.all(by.repeater('subunidade in consultarUnidadeCtrl.listaSubunidades').row(0));
    this.listaTabela = element.all(by.repeater('unidade in consultarUnidadeCtrl.listaConsultaUnidadeDTO'));
    this.btnBuscar = element(by.id('btn-buscar'));
    this.btnCadastrar = element(by.id('btn-cadastrar'));

    //Cadastrar unidades;

    this.comboUnidadeCadastro = element(by.id('select-unidades'));
    this.selectUnidadeCadastro = element(by.repeater('unidade in cadastrarUnidadeCtrl.listaUnidade').row(0));
    this.comboSubUnidadeCadastro = element(by.id('select-sub-unidades'));
    this.selectSubUnidadeCadastro = element(by.repeater('subunidade in cadastrarUnidadeCtrl.listaSubunidades | filter:cadastrarUnidadeCtrl.searchTerm').row(0));
    this.backdrop = element(by.tagName('md-backdrop'));
    this.btnSalvar = element(by.id('btn-salvar'));
    this.alertaSalvoComSucesso = element(by.cssContainingText('md-toast-content', 'Dados enviados com sucesso.'));

    ConsultarUnidadePage.prototype.espera = function (segundos) {
        var miliSegundos = segundos * 1000;
        browser.sleep(miliSegundos);
    }

    ConsultarUnidadePage.prototype.selecionaUnidade = function () {
        this.comboUnidade.click();
        this.espera(1);
        this.selectUnidade.click();
        this.espera(1);
    }

    ConsultarUnidadePage.prototype.selecionaSubUnidade = function () {
        this.comboSubUnidade.click();
        this.espera(1);
        this.selectSubUnidade.click();
        this.espera(1);

    }

    ConsultarUnidadePage.prototype.buscar = function () {
        this.btnBuscar.click();
    }

    ConsultarUnidadePage.prototype.irParaCadastro = function () {
        this.btnCadastrar.click();
    }

    ConsultarUnidadePage.prototype.selecionaUnidadeCadastro = function () {
        this.comboUnidadeCadastro.click();
        this.espera(1);
        this.selectUnidadeCadastro.click();
        this.espera(1);
    }

    ConsultarUnidadePage.prototype.selecionaSubUnidadeCadastro = function () {
        this.comboSubUnidadeCadastro.click();
        this.espera(1);
        this.selectSubUnidadeCadastro.click();
        this.espera(1);
        this.backdrop.click();
    }

    ConsultarUnidadePage.prototype.salvar = function () {
        this.btnSalvar.click();
        this.espera(1);
    }

}

module.exports = ConsultarUnidadePage;
