'use strict';

angular.module('sdsicApp').factory('errorHandlerInterceptor', function($q, $rootScope, $window, $injector){

    var toastr;

    function getToaster(){
        if(!toastr){
            toastr = $injector.get("$mdToast");
        }
        return toastr;
    }

    return {
        'responseError': function(response){
            if(!(response.status == 401 && response.data.path.indexOf("/api/account") == 0 )){
                $rootScope.$emit('sdsicApp.httpError', response);
            }

            if(response.status == 403){
                $window.location.href = '/sdsic/api';
            }

            if(response.status == 400 && response.headers("X-sdsicApp-error")){
                getToaster().show(
                    getToaster().simple()
                        .textContent(response.headers("X-sdsicApp-error"))
                        .hideDelay(5000)
                );
            }

            return $q.reject(response);
        }
    };
});
