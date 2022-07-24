var ConsultarGlossarioPage = function () {

    //Consultar unidades
    this.comboAssunto = element(by.id('select-assunto'));
    this.selectAssunto = element.all(by.repeater('tema in consultaGlossarioTemasCtrl.listaTodosTemas').row(0));
    this.comboSubAssunto = element(by.id('select-sub-assunto'));
    this.selectSubassunto = element.all(by.repeater('subtema in consultaGlossarioTemasCtrl.listaSubtemas').row(0));
    this.listaTabela = element.all(by.repeater('subtema in consultaGlossarioTemasCtrl.subtemas'));
    this.comboPalavraChave = element(by.id('select-palavra'));
    this.selectPalavraChave = element.all(by.repeater('palavraChave in consultaGlossarioTemasCtrl.palavrasChaves').row(0));
    this.btnBuscar = element(by.id('btn-buscar'));
    this.btnCadastrar = element(by.id('btn-cadastrar'));

    //Cadastrar unidades;
    this.comboAssuntoCadastro = element(by.id('select-assuntos'));
    this.comboSubAssuntoCadastro = element(by.id('select-sub-assuntos'));
    this.backdrop = element(by.tagName('md-backdrop'));
    this.btnIncluir = element(by.id('btn-incluir'));
    this.btnSalvar = element(by.id('btn-salvar'));
    this.alertaSalvoComSucesso = element(by.cssContainingText('md-toast-content', 'Dados enviados com sucesso.'));

    ConsultarGlossarioPage.prototype.espera = function (segundos) {
        var miliSegundos = segundos * 1000;
        browser.sleep(miliSegundos);
    }

    ConsultarGlossarioPage.prototype.selecionaUnidade = function () {
        this.comboAssunto.click();
        this.espera(1);
        this.selectAssunto.click();
        this.espera(1);
    }

    ConsultarGlossarioPage.prototype.selecionaSubUnidade = function () {
        this.comboSubAssunto.click();
        this.espera(1);
        this.selectSubassunto.click();
        this.espera(1);

    }

    ConsultarGlossarioPage.prototype.selecionaPalavraChave = function (){
        this.comboPalavraChave.click();
        this.espera(1);
        this.selectPalavraChave.click();
        this.espera(1);
    }

    ConsultarGlossarioPage.prototype.buscar = function () {
        this.btnBuscar.click();
    }

    ConsultarGlossarioPage.prototype.irParaCadastro = function () {
        this.btnCadastrar.click();
    }

    ConsultarGlossarioPage.prototype.selecionaUnidadeCadastro = function () {
        this.comboAssuntoCadastro.click();
        this.espera(1);
        this.selectUnidadeCadastro.click();
        this.espera(1);
    }

    ConsultarGlossarioPage.prototype.selecionaSubUnidadeCadastro = function () {
        this.comboSubAssuntoCadastro.click();
        this.espera(1);
        this.selectSubUnidadeCadastro.click();
        this.espera(1);
        this.backdrop.click();
    }

    ConsultarGlossarioPage.prototype.salvar = function () {
        this.btnSalvar.click();
        this.espera(1);
    }

}

module.exports = ConsultarGlossarioPage;
