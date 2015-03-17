angular.module('Druponic.directives', []);

angular.module('Druponic.directives').directive('swipeback', function ($ionicGesture, $ionicViewService) {

    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element) {
            $ionicGesture.on("swiperight", function (e) {
                window.history.back();
            }, element)
        }
    };
});

//photoswipe directive: https://github.com/ValentinGavan/PhotoSwipe
angular.module('Druponic.directives').directive('photoswipe', function () {
    return {
        replace: false,
        restrict: 'A',
        link: function photoSwipeLink(scope, element, attr) {
            scope.$on("swipeReady", function () {
                window.Code.PhotoSwipe.attach(element.find('a'), {
                    enableMouseWheel: false,
                    enableKeyboard: false,
                    backButtonHideEnabled: false
                });
            })

        }
    };
});