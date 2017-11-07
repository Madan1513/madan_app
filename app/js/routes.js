define(['dependencyResolverFor'], function (dependencyResolverFor) {
    var loadController = function (controllerName) {
        return ["$q", function ($q) {
            var deferred = $q.defer();
            require([controllerName], function () {
                deferred.resolve();
            });
            return deferred.promise;
        }];
    };

    return {
        defaultRoutePath: '/dashboard/myForecast',
        states: [{
                name: "navigation",
                data: {
                    templateUrl: 'views/navigation.html',
                    controller: 'NavigationCtrl',
                    resolve: {
                        NavigationCtrl: loadController("js/controllers/NavigationController")
                    }
                }
            },
            {
                name: "error",
                data: {
                    url: '/error',
                    templateUrl: 'views/error.html'
                }
            },
            {
                name: "navigation.dashboard",
                data: {
                    url: '/dashboard',
                    templateUrl: 'views/dashboard.html',
                    controller: 'DashboardCtrl',
                    resolve: {
                        DashboardCtrl: loadController("js/controllers/DashboardController")
                    }
                }
            },
            {
                name: "navigation.dashboard.myforecast",
                data: {
                    url: '/myForecast',
                    templateUrl: 'views/myForecast.html',
                    controller: 'MyForecastCtrl',
                    resolve: {
                        MyForecastCtrl: loadController("js/controllers/MyForecastController")
                    }
                }
            },
            {
                name: "navigation.admin",
                data: {
                    url: '/admin',
                    templateUrl: 'views/adminPage.html',
                    controller: 'AdminCtrl',
                    resolve: {
                        AdminPageCtrl: loadController("js/controllers/AdminController")
                    }
                }
            }
        ]
    };
});