define(['app'], function (app) {
    app.controller('NavigationCtrl', ['$scope', '$state', '$http', function ($scope, $state, $http) {
        $scope.userData = [];
        $http.get("http://localhost:7000/periscope/getuserinfo")
            .then(function (response) {
                $scope.userData = response.data;
                if($scope.userData.length != 0){
                    $state.go('navigation.dashboard.myforecast');
                }
                else{
                    $state.go('error');
                }
            });
        $scope.currentState = $state.current.name.split(".")[1];
    }]);
});