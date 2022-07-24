var URL_AVATAR_ICONS = 'assets/img/icons/avatars.svg';
var URL_ICON_MENU = 'assets/img/icons/menu.svg';
var URL_ICON_SHARE = 'assets/img/icons/share.svg';
var URL_ICON_PERSON = 'assets/img/icons/ic_person_48px.svg';
var URL_LOGOUT = 'assets/img/icons/ic_power_settings_new_48px.svg';

angular.module('sdsicApp').run(function($rootScope, $location, $window, $http, $state, ENV, VERSION, usuarioService){

    $rootScope.ENV = ENV;
    $rootScope.VERSION = VERSION;

    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){
        $rootScope.toState = toState.name;
        $rootScope.toStateParams = toStateParams;
        // Obter nome do perfil de usuário logado.
        obterPerfil();
        obterUsuarioLogadoV2();
        $rootScope.session = JSON.parse(sessionStorage.getItem("session-security"));

        if (toState.authorization && !$rootScope.session.authorized) {
            event.preventDefault();
            $state.go('perfis');
        }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        var titleKey = 'Sistemas de Demanda do Serviços de Informações ao Cidadão - FKSOLUTIONS';
        if(toState.name != 'login' && $rootScope.previousStateName){
            $rootScope.previousStateName = fromState.name;
            $rootScope.previousStateParams = fromParams;
        }
        if(toState.data && toState.data.pageTitle){
            titleKey = toState.data.pageTitle;
        }
        $window.document.title = titleKey;
    });

    $rootScope.back = function(){
        if($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null){
            $state.go('home');
        }else{
            $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
        }
    };

    function obterPerfil () {
        if (angular.isUndefined($rootScope.nomePerfil)) {
            usuarioService.obterPerfil().then(function(response){
                $rootScope.nomePerfil = response.data;
            });
        }
    }

    function obterUsuarioLogadoV2 () {
        if (angular.isUndefined($rootScope.usuarioLogadoV2)) {
            usuarioService.getUsuarioLogadoPerfis().then(function(response){
                $rootScope.usuarioLogadoV2 = response.data;
            });
        }
    }
});
