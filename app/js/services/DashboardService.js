define(['app'], function (app) {
    app.factory('DashboardService', DashboardService);
    DashboardService.$inject = ['$http', '$q'];

    function DashboardService($http, $q) {
        return {
            baseUrl: 'http://localhost:7000/periscope',

            getDataByAllYears: function () {
                var deferred = $q.defer();
                $http.get(this.baseUrl + '/getOutageDataOnLoad')
                    .then(function (res) {
                            deferred.resolve(res);
                        },
                        function (error) {
                            deferred.reject('Error fetching Region Data ' + error);
                        });
                return deferred.promise;
            },

            getOutageData: function (val) {
                var deferred = $q.defer();
                var tObj = {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
                $http.post(this.baseUrl + '/getOutageData', val, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    .then(function (res) {
                            deferred.resolve(res);
                        },
                        function (error) {
                            deferred.reject('Error fetching Outage Year Data ' + error);
                        });
                return deferred.promise;
            },

            getBOMData: function (outageID) {
                var deferred = $q.defer();
                $http.get(this.baseUrl + '/getBomDetails/' + outageID)
                    .then(function (res) {
                            deferred.resolve(res);
                        },
                        function (error) {
                            deferred.reject('Error fetching Region Data ' + error);
                        });
                return deferred.promise;
            },
        }
    }
});