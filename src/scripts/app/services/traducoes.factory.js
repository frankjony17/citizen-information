/**
 * Created by gabriel on 29/08/16.
 */
(function(){
    angular.module('sdsicApp').factory('Traducoes', factory);

    factory.$inject = ['$translatePartialLoader', '$translate'];

    function factory($translatePartialLoader, $translate){
        return function(){
            angular.forEach(arguments, function(translationKey){
                $translatePartialLoader.addPart(translationKey);
            });
            $translatePartialLoader.addPart('scripts/app/language');

            return $translate.refresh();
        }
    }
})();
