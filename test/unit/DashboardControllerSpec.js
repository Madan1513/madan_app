'use strict';

module('app', function (app) {});

define(['js/controllers/DashboardController'], function (app) {
    describe("The DashboardController", function () {
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

            controller('DashboardCtrl', {
                $scope: scope,
                $state: mocks.state
            });
        });
        it('Should have loaded the controller', function () {
            expect(controller).toBeDefined();
            expect(scope).toBeDefined();
        });
        it("Should have a correct state", function () {
            expect(scope.currentSubState).toBe("myforecast");
        });
        it('Should have instantiate all scope variables', function () {
            expect(controller).toBeDefined();
            expect(scope.regionModel).toBeDefined();
            expect(scope.regionData).toBeDefined();
            expect(scope.regionCustomTexts).toBeDefined();
            expect(scope.subRegionModel).toBeDefined();
            expect(scope.subRegionData).toBeDefined();
            expect(scope.platformModel).toBeDefined();
            expect(scope.platformData).toBeDefined();
            expect(scope.frameSizeCustomTexts).toBeDefined();
            expect(scope.frameSizeModel).toBeDefined();            
            expect(scope.subRegionCustomTexts).toBeDefined();
            expect(scope.frameSizeData).toBeDefined();
            expect(scope.outagetypeCustomTexts).toBeDefined();
            expect(scope.outagetypeModel).toBeDefined();
            expect(scope.outagetypeData).toBeDefined();
            expect(scope.customerCustomTexts).toBeDefined();
            expect(scope.customerData).toBeDefined();
            expect(scope.customerModel).toBeDefined();
            expect(scope.outageQuarterModel).toBeDefined();
            expect(scope.outageQuarterData).toBeDefined();
            expect(scope.outageYearCustomTexts).toBeDefined();
            expect(scope.outageYearModel).toBeDefined();
            expect(scope.outageYearData).toBeDefined();
            expect(scope.outages).toBeDefined();            
            expect(scope.dataSendObj).toBeDefined();            
            expect(scope.outageYearData).toBeDefined();            
            expect(scope.outageYearData).toBeDefined();            
            expect(scope.outageYearData).toBeDefined();            
            expect(scope.outageYearData).toBeDefined();          
            expect(scope.loading).toBeTruthy();
        });
        it('Should have change the different scope variables once $scope.onFilterChange() triggered', function () {
            scope.onFilterChange();
            expect(scope.loading).toBeTruthy();
            scope.uncheckAllQuaters();
            expect(scope.dataSendObj.outageQuarter.length).toEqual(0); 
        });
    });
});