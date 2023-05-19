var app = angular.module("myapp", ["ngRoute"]);

app.controller("mycontroller", function ($scope, $http) {
  $scope.getPost = function () {
    console.log($scope);
    $http
      .get(`/searchresults?term=${$scope.searchTerm}`)

      .then(function (response) {
        $scope.posts = response.data.data;
      });
  };
});
app.controller("mycontroller1", function ($scope, $http,$location) {
  $scope.posts = [];
    var getPosts = function () {
    $http
      .get("/posts")
      .then(function (response) {
        console.log(response.data.data)
        $scope.posts = response.data.data;
      })
      .catch(function (error) {
        console.error("Error retrieving posts:", error);
      });
  };
    getPosts();
});

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: `route.html`,
    })
    .when("/home", {
      templateUrl: `home.html`,
      controller: "mycontroller1"
    })
    .when("/about", {
      templateUrl: `about.html`,
    })
    .when("/favourites", {
      templateUrl: `favourites.html`,
    })
    .when("/create", {
      templateUrl: `create.html`,
    })
    .when("/search", {
      templateUrl: `search.html`,
    });
});
