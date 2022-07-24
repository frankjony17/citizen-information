(function () {
    'use strict';
    angular.module('sdsicApp').directive('exibirElementoPorPermissao', function ($rootScope) {
        return ({
            restrict: 'A',
            link: function link($scope, element, $attr) {
                // angular.element(element).addClass('invisivel');
                // var verificarPermissao = function () {
                //     var roles = ($attr.exibirElementoPorPermissao || '').split(',');
                //     var usuarioLogado = $rootScope.usuarioLogado;
                //     var possuiPermissoes = usuarioLogado && usuarioLogado.permissoes;
                //     for (var i = 0; i < roles.length && possuiPermissoes; i++) {
                //         if (usuarioLogado.permissoes.indexOf(roles[i].trim()) != -1) {
                //             angular.element(element).removeClass('invisivel');
                //             return;
                //         }
                //     }
                //     angular.element(element).remove();
                // };
                // $scope.$watch('usuarioLogado', function (values) {
                //     if (values || angular.isDefined($rootScope.usuarioLogado)) {
                //         verificarPermissao();
                //     }
                // });
            }
        });
    });
})();
