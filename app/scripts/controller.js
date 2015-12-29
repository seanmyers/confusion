'use strict';

angular.module('confusionApp')

        .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            //$scope.dishes = [];

            menuFactory.getDishes()
            .then(
                function(response) {
                    $scope.dishes = response.data;
                }
            );


            $scope.select = function(setTab) {
                $scope.tab = setTab;

                if (setTab === 2) {
                    $scope.filtText = {category : "appetizer"};
                }
                else if (setTab === 3) {
                    $scope.filtText = {category : "mains"};
                }
                else if (setTab === 4) {
                    $scope.filtText = {category : "dessert"};
                }
                else {
                    $scope.filtText = {category : ""};
                }
            };

            $scope.isSelected = function (checkTab) {
                return ($scope.tab === checkTab);
            };

            $scope.toggleDetails = function() {
                $scope.showDetails = !$scope.showDetails;
            };
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

            $scope.channels = channels;
            $scope.invalidChannelSelection = false;

        }])

        .controller('FeedbackController', ['$scope', function($scope) {

            $scope.sendFeedback = function() {

                console.log($scope.feedback);

                if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                    console.log($scope.feedback);
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

            $scope.dish = {};

            menuFactory.getDish(parseInt($stateParams.id,10))
            .then(
                function(response) {
                    $scope.dish = response.data;
                }
            );

        }])

        .controller('DishCommentController', ['$scope', function($scope) {

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

            $scope.submitComment = function () {

                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);

                $scope.dish.comments.push($scope.mycomment);

                $scope.commentForm.$setPristine();

                $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            };
        }])

        // implement the IndexController and About Controller here
        .controller('IndexController', ['$scope', '$stateParams', 'menuFactory',
            'corporateFactory', function($scope,$stateParams,menuFactory,corporateFactory) {
                $scope.featuredish = {};
                menuFactory.getDish(0)
                .then(
                    function(response) {
                        $scope.featuredish = response.data;
                    }
                );

                $scope.promotion = menuFactory.getPromotion(0);
                $scope.leader = corporateFactory.getLeader(3);
            }
        ])

        .controller('AboutController',['$scope', '$stateParams', 'corporateFactory',
            function($scope,$stateParams,corporateFactory) {
                $scope.leaders = corporateFactory.getLeaders();
            }
        ])

;
