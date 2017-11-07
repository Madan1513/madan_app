'use strict';

module('app', function (app) {});

define(['js/controllers/NavigationController'], function (app) {
    describe("The NavigationController", function () {
        var rootScope, controller, scope, state, mocks;
        beforeEach(function () {
            module('app');
            inject
                ([
                    '$injector',
                    '$rootScope',
                    '$controller',
                    function ($injector, _$rootScope, _$controller) {
                        rootScope = _$rootScope;
                        scope = rootScope.$new();
                        controller = _$controller;
                        mocks = {
                            state: {
                                current: {
                                    name: 'navigation.dashboard.myforecast'
                                }
                            }
                        };
                    }
                ]);

            controller('NavigationCtrl', {
                $scope: scope,
                $state: mocks.state
            });
        });
        it('Should have loaded the controller', function () {
            expect(controller).toBeDefined();
            expect(scope).toBeDefined();
        });
        it("Should have the correct state", function () {
            expect(scope.currentState).toBe("dashboard");
        });
    });
});