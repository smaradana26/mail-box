var app = angular.module('mainApp',['ui.router']);

/** Application routes */
app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('mail');

	$stateProvider
	.state("mail",{
		url: "/mail",
		templateUrl: "./mailList.html",
		controller: "HomeController"
	})
    .state("details", {
		url : "/details/:id",
        templateUrl : "./details.html",
		controller: "DetailsController"
    })
    .state("sent", {
        url: "/sent",
        template: "<div>No sent items</div>"
    })
    .state("drafts", {
        url: "/drafts",
        template: "<div>No draft items</div>"
    })
    .state("spam", {
        url: "/spam",
        template: "<div>Spam is empty</div>"
    })
    .state("trash", {
        url: "/trash",
        template: "<div>Trash is empty</div>"
    });
});


/** custom filter to capitalize first character */
app.filter('capitalize', function() {
    return function(str){
        return (String(str) && str) ? str[0].toUpperCase() + str.substring(1).toLowerCase() : str;
    }
});

/** Service calls */
app.factory('RestApi', ['$http',function($http){

    return {
        getSearchResults: function(str){
            return $http({
                method: 'GET',
                url: 'https://jsonplaceholder.typicode.com/users'
            });
        },
        getMailsList: function(){
            return $http({
                method: 'GET',
                url: 'https://jsonplaceholder.typicode.com/posts'
            });
        },
        getMailById: function(pid){
            return $http({
                method: 'GET',
                url: 'https://jsonplaceholder.typicode.com/posts',
                params: {id:pid}
            });
        }
    }
}]);

/** home controller */
app.controller('HomeController',['$scope', 'RestApi', '$location', function($scope, RestApi, $location){

    $scope.search = '';

    // search through user names
    $scope.getSearchResults = function(str) {

        RestApi.getSearchResults(str)
        .then(function(response){
            $scope.userData= response.data;
            
        }, function(err){
            console.log("Failed", err);
        });
    };

    // get mailing list
    $scope.getMailsList = function(){
        RestApi.getMailsList()
        .then(function(response){
            $scope.mailsList = response.data;
        }, function(error){
            console.log("Failed", error);
        })
    };

    $scope.getMailsList();

    // get posts by user
    $scope.getUserPosts = function(uid, uname){
        $scope.selectedUid = uid;
        $scope.selectedUsername = uname;
        $scope.getMailsList();
        $scope.search = uname;
        $scope.userData = '';
    }

    // view mail
    $scope.viewMail = function(pid){
        $location.path("/details/"+pid);
    };

    // Clear search
    $scope.clear = function() {
       $scope.search = '';
       $scope.selectedUid = '';
       $scope.selectedUsername = '';          
    }

}]);

/** details page controller */
app.controller("DetailsController",['$scope', 'RestApi', '$stateParams', 
function($scope, RestApi, $stateParams){
    
    $scope.pid = $stateParams.id;

    // view mail by id
    $scope.getMailDetails = function(pid){
        RestApi.getMailById(pid).then(function(response){
            $scope.mailContent = response.data[0];
        }, function(error){
            console.log("Failed", error);
        });
    };

    $scope.getMailDetails($scope.pid);
}]);