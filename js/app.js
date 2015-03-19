angular.module('Druponic', ['ionic', 'Druponic.controllers', 'Druponic.services', 'Druponic.directives'])
    .constant('apiEndpoint', 'http://xuchang.wechat.secenter.cn//')
    .run(function ($ionicPlatform, apiEndpoint, $http, $ionicModal, $rootScope, $ionicViewService) {
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('menu', {
                url: "/menu",
                templateUrl: "template/amenu.html"
            }).state('page', {
                url: "/page/:template/:id",
                templateUrl: function ($stateParams) {
                    return 'template/' + $stateParams.template + '.html';
                },
                controller: "PageCtrl"
            }).state('list', {
                url: "/list/:template/:subtemplate",
                templateUrl: function ($stateParams) {
                    return 'template/' + $stateParams.template + '.html';
                },
                controller: "ListCtrl"
            }).state('list-category', {
                url: "/list/:template/:subtemplate/:tid",
                templateUrl: function ($stateParams) {
                    return 'template/' + $stateParams.template + '.html';
                },
                controller: "ListCtrl"
            })
            .state('gallery', {
                url: "/gallery/:template/:gallery",
                templateUrl: function ($stateParams) {
                    return 'template/gallery/' + $stateParams.template + '.html';
                },
                controller: "galleryCtrl"
            })
            .state('gallery-category', {
                url: "/gallery/:template/:gallery/:tid",
                templateUrl: function ($stateParams) {
                    return 'template/gallery/' + $stateParams.template + '.html';
                },
                controller: "galleryCtrl"
            })
            .state('contact', {
                url: "/contact",
                templateUrl: "template/contact.html"
            })
            .state('resume', {
                url: "/resume",
                templateUrl: "template/resume.html"
            })
            .state('collection', {
                url: "/collection",
                templateUrl: "template/collection.html",
                controller: "collectionCtrl"
            })
            .state('address', {
                url: "/address",
                templateUrl: "template/address.html"
            });

        $urlRouterProvider.otherwise('/page/homepage/1');

    })
    .controller('homepageCtrl', function ($scope, $http, $ionicSlideBoxDelegate) {
        $ionicSlideBoxDelegate.enableSlide(false);
        $http.get('data/home-page-menu.json')
            .then(function (res) {
                $scope.linkList = res.data;

            });
    })
    .controller('collectionCtrl', function ($scope, $http, lazyHttp, apiEndpoint, Favors) {
        $scope.list = Favors.all();

        $scope.cleanFavor = function () {
            $scope.list = [];
            window.localStorage['favors'] = [];
        }
    })
    .factory('Favors', function () {
        return {
            all: function () {
                var favorString = window.localStorage['favors'];
                if (favorString) {
                    return angular.fromJson(favorString);
                }
                return [];
            },
            save: function (favors) {
                window.localStorage['favors'] = angular.toJson(favors);
            },
            newProject: function (item) {
                // Add a new project
                return item;
            }
        }
    });


