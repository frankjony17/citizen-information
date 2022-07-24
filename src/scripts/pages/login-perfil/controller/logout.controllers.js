(function () {
    'use strict';
    angular.module('sdsicApp').controller("LogoutController", [controller]);
        function controller() {

            window.sessionStorage.setItem("session-security", JSON.stringify({
                authorized: false,
                perfil: null,
                usuario: null
            }));
            window.location.href = '/sdsic/api/saml/logout';
        }
})();
