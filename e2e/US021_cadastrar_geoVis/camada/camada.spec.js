const CamadaPage = require('./camada.po');
const massaTeste = require('./massa-teste.json');

describe('US021-Cadastrar GeoVis Admin - CAMADA', function () {

  const page = new CamadaPage();

  beforeAll(function () {
    page.waitUrl();
    page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/cadastrar');
  });

  it('URL camada inválida', function () {
    page.selecionarOpcaoCamada();
    page.informarDadosCamadaParcial(massaTeste.camadaUrlInvalida);
    page.esprarCaixaDialogo();
    expect(page.popUpMensagem.getText()).toEqual('URL inválida');
    page.espera(2);
  });

  it('URL camada já cadastrada', function () {
    page.recarregar();
    page.selecionarOpcaoCamada();
    page.informarDadosCamadaParcial(massaTeste.camadaJaCadastrada);
    page.esprarCaixaDialogo();
    expect(page.popUpMensagem.getText()).toEqual('Url já cadastrada');
    page.espera(2);
  });

  it('Camada cadastrada com sucesso', function () {
    page.recarregar();
    page.selecionarOpcaoCamada();
    page.informarDadosCamada(massaTeste.camadaUrlValida);
    page.waitBtnGravar();
    page.informarDadosResponsavel(massaTeste.camadaUrlValida);
    page.gravarDados();
    page.esprarCaixaDialogo();
    expect(page.popUpMensagem.getText()).toEqual('Cadastrado com sucesso!');
    page.espera(2);
  });

  it('Alterar Camada', function () {
    page.recarregar();
    page.ir('http://spunet-geovisualizador.tst.basis.com.br/#/geovisualizador/catalogo/editar/3');
    page.gravarDados();
    page.esprarCaixaDialogo();
    expect(page.popUpMensagem.getText()).toEqual('Alterado com sucesso!');
    page.espera(2);
  });

});
