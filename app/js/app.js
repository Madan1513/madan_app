define(['routes', 'uiBootstrap', 'angular-ui-router', 'ng-multiselect-dropdown'], function (config) {
    var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'angularjs-dropdown-multiselect']);

    app.config(
        [
            '$locationProvider',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$provide',
            '$stateProvider',
            '$urlRouterProvider',

            function ($locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider, $urlRouterProvider, $http) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;

                if (config.states !== undefined) {
                    angular.forEach(config.states, function (states, path) {
                        $stateProvider.state(states.name, states.data);
                    });
                }

                if (config.defaultRoutePath !== undefined) {
                    $urlRouterProvider.otherwise(config.defaultRoutePath);
                }
            }
        ]);
    return app;
});