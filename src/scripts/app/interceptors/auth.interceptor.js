'use strict';
/**
 * Para interceptar as tentativas de requisições depois da sessão expirar no servidor
 */
angular.module('sdsicApp')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService) {
        return {
            responseError: function (response) {

                if (response.status == 401 && response.data.path !== undefined && response.data.path.indexOf("/api/login") == -1) {
                    //
                }
                return $q.reject(response);
            }
        };
    });
