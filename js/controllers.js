angular.module('Druponic.controllers', [])
    .controller('PageCtrl', function ($rootScope, $scope, $http, $stateParams, apiEndpoint, $ionicSlideBoxDelegate, lazyHttp) {
        $scope.page = {};
        lazyHttp.get(apiEndpoint + "api/views/general_page.json?args[0]=" + $stateParams.id, true).then(function (data) {
            $scope.page = data[0];

            if ($scope.page.slider) {
                $scope.page.slider = $scope.page.slider.split(",");

                $ionicSlideBoxDelegate.update();

                //TODO: find a better solution
                setTimeout(function () {
                    $scope.$broadcast("swipeReady")

                }, 500)
            }
            //render links in page as items
            if ($scope.page.linkstitle) {
                $scope.page.linkstitle = $scope.page.linkstitle.split("^");
                $scope.page.linksurl = $scope.page.linksurl.split("^");

            }

        });

    });


angular.module('Druponic.controllers')
    .controller('ListCtrl', function ($scope, $http, $stateParams, apiEndpoint, $ionicSlideBoxDelegate, lazyHttp) {
        $scope.list = [];
        $scope.matrix = [];
        $scope.subtemplate = $stateParams.subtemplate;

        $scope.toGrid = function (elementsPerSubArray) {
            var matrix = [], i, k;
            for (i = 0, k = -1; i < $scope.list.length; i++) {
                if (i % elementsPerSubArray === 0) {
                    k++;
                    matrix[k] = [];
                }
                matrix[k].push($scope.list[i]);
            }
            return matrix;
        };

        var url = "";
        if ($stateParams.tid) {
            url = apiEndpoint + "api/views/general_list.json?args[0]=" + $stateParams.tid;
        } else {
            url = apiEndpoint + "api/views/general_list.json";
        }
        lazyHttp.get(url, true).then(function (data) {
            $scope.list = data;
            $scope.matrix = $scope.toGrid(2);
            $ionicSlideBoxDelegate.update()
        })

    });

angular.module('Druponic.controllers')
    .controller('mainCtrl', function($scope, $ionicModal, $http) {
        $scope.isOpen = false;

        $scope.closeGallery = function(){
            $scope.$broadcast ('closeModal');
        }

        $http.get('data/main-menu.json')
            .then(function(res){
                $scope.linkList = res.data;

            });

        $ionicModal.fromTemplateUrl('template/menu.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
                $scope.modal = modal;
            });
        $scope.openModal = function() {

            $scope.modal.show();
            $scope.isOpen = true;

        };
        $scope.closeModal = function() {

            $scope.modal.hide();
            $scope.isOpen = false;
        };
        $scope.toggleModal = function() {
            if($scope.isOpen){
                $scope.modal.hide();
                $scope.isOpen = false;
            }
            else
            {
                $scope.modal.show();
                $scope.isOpen = true;
            }
        };
    });

angular.module('Druponic.controllers')
    .controller('galleryCtrl', function($timeout, $scope, $stateParams, $http, $ionicSlideBoxDelegate, $ionicModal, lazyHttp, apiEndpoint, Favors) {
        $scope.action = "openGallery();goToSlide($index)";
        $scope.list = [];
        var serviceUrl = "";
//        console.log($scope.page);


        if($scope.page && $scope.page.reference_type &&  $scope.page.reference_type == "Gallery"){
            serviceUrl = apiEndpoint + "api/views/gallery.json?limit=0&args[0]=" + $scope.page.reference_nid;
        }
        else if($stateParams.gallery == "all"){
            serviceUrl = apiEndpoint + "api/views/gallery.json?limit=0&args[0]=all&args[1]=" +  $stateParams.tid;
        }
        else
        {
            serviceUrl = apiEndpoint + "api/views/gallery.json?limit=0&args[0]=" + $stateParams.gallery;
        }
        lazyHttp.get(serviceUrl, true).then(function (data) {
//            console.log(data);
            for(var i in data){
                var rexImage = /<img.*?src="(.*?\/([^\/"]*))".*?>/g
                var rexThumb = /<img.*?src="(.*?\/([^\/"]*))".*?>/g
                var srcImg = rexImage.exec(data[i].img);
                var srcThumb = rexThumb.exec(data[i].thumb);
                if(srcImg){
                    data[i].img =  srcImg[1];
                }
                if(srcThumb){
                    data[i].thumb =  srcThumb[1];
                }
            }

            $scope.currentSlide = 0;
            // console.log('Active Slide=' + $scope.currentSlide);
            $scope.slideChanged = function(slide) {
                $scope.currentSlide = $ionicSlideBoxDelegate.currentIndex();
                // console.log('Active Slide=' + $scope.currentSlide);
            };

            $scope.list = data;

            $ionicSlideBoxDelegate.update();
        });
        $scope.goToSlide = function(index)
        {
            $ionicSlideBoxDelegate.slide(index,0);
        };


        // favor
        $scope.favors = Favors.all();

        $scope.addToFavor = function() {
            var currentItem = $scope.list[$ionicSlideBoxDelegate.currentIndex()];
            for (var i=0; i< $scope.favors.length; i++) {
                if(currentItem.img == $scope.favors[i].img){
                    return;
                }
            }
            var newFavor = Favors.newProject(currentItem);
            $scope.favors.push(newFavor);
            Favors.save($scope.favors);



        };

        // gallery thumb modal
        $scope.isOpenGallery = false;
        $scope.showList = true;
        $ionicModal.fromTemplateUrl('template/gallery-b/modal/contain.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
                $scope.galleryModal = modal;
            });
        $scope.openGallery = function() {
            $scope.galleryModal.show();
            $scope.isOpenGallery = true;
            $timeout(function() {
                $ionicSlideBoxDelegate.update();
            }, 100)
        };

        $scope.closeGallery = function() {
            $scope.galleryModal.hide();
            $scope.isOpenGallery = false;

        };
        $scope.toggleGallery = function() {
            if($scope.isOpenGallery){
                $scope.closeGallery();
            }else{
                $scope.openGallery();
            }
        };


        // info box
        $scope.isOpenInfoBox = false;
        $ionicModal.fromTemplateUrl('template/gallery-b/modal/photo-info-box.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
                $scope.infoBox = modal;
            });

        $scope.openInfoBox = function() {
            $scope.infoBox.show();
            $scope.isOpenInfoBox = true;
            $scope.currentItem = $scope.list[$ionicSlideBoxDelegate.currentIndex()];

        };
        $scope.closeInfoBox = function() {
            $scope.infoBox.hide();
            $scope.isOpenInfoBox = false;

        };
        $scope.toggleInfoBox = function() {
            if($scope.isOpenInfoBox){
                $scope.infoBox.hide();
                $scope.isOpenInfoBox = false;
            }
            else{
                $scope.infoBox.show();
                $scope.isOpenInfoBox = true;
            }
        };

        $scope.$on('closeModal', function(e) {
            $scope.closeGallery();
            $scope.closeInfoBox();
        });

    });