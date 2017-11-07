define(['app', 'googleMap', 'DashboardService'], function (app) {
    app.controller('DashboardCtrl', ['$scope', '$state', '$filter', 'DashboardService', function ($scope, $state, $filter, DashboardService) {
        $scope.currentSubState = $state.current.name.split(".")[2];

        // Initialization for the filters

        $scope.regionCustomTexts = {
            buttonDefaultText: 'Region'
        };
        $scope.regionModel = [];
        $scope.regionData = [];
        $scope.subRegionCustomTexts = {
            buttonDefaultText: 'Sub Region'
        };
        $scope.subRegionModel = [];
        $scope.subRegionData = [];
        $scope.platformCustomTexts = {
            buttonDefaultText: 'Platform'
        };
        $scope.platformModel = [];
        $scope.platformData = [];
        $scope.frameSizeCustomTexts = {
            buttonDefaultText: 'Frame Size'
        };
        $scope.frameSizeModel = [];
        $scope.frameSizeData = [];
        $scope.outagetypeCustomTexts = {
            buttonDefaultText: 'Outage Type'
        };
        $scope.outagetypeModel = [];
        $scope.outagetypeData = [];
        $scope.customerCustomTexts = {
            buttonDefaultText: 'Customer'
        };
        $scope.customerModel = [];
        $scope.customerData = [];
        $scope.outageQuarterModel = [];
        $scope.outageQuarterData = [{
            id: "Q1",
            val: false
        }, {
            id: "Q2",
            val: false
        }, {
            id: "Q3",
            val: false
        }, {
            id: "Q4",
            val: false
        }];
        $scope.outageYearCustomTexts = {
            buttonDefaultText: 'Outage Year'
        };
        $scope.outageYearModel = [];
        $scope.outageYearData = [];
        $scope.outages = [];
        $scope.dataSendObj = {
            "outageYear": [],
            "outageQuarter": [],
            "region": [],
            "subRegion": [],
            "customer": [],
            "platform": [],
            "frameSize": [],
            "outagetype": []
        };

        $scope.formatData = function (arr) {
            arr.sort();
            var array = [];
            for (var i = 0; i < arr.length; i++) {
                array.push({
                    id: arr[i]
                });
            }
            return array;
        }

        $scope.updateData = function (data) {
            $scope.outageYearData = $scope.formatData(data.outageYearFilter);
            $scope.regionData = $scope.formatData(data.regionFilter);
            $scope.subRegionData = $scope.formatData(data.subRegionFilter);
            $scope.platformData = $scope.formatData(data.platformFilter);
            $scope.frameSizeData = $scope.formatData(data.frameSizeFilter);
            $scope.outagetypeData = $scope.formatData(data.outageTypeFilter);
            $scope.customerData = $scope.formatData(data.customerFilter);
            $scope.outages = data.outgagesDetailListbyfilter;
            // $scope.savingVolume = data.savingVolumeOutagebyRegion;
            $scope.platformChartData = data.chartData[0].platformList;
            $scope.outageTypeChartData = data.chartData[0].outageTypeList;
            $scope.frameSizeChartData = data.chartData[0].frameSizeList;
            $scope.customerChartData = data.chartData[0].customerList;
            $scope.regionChartData = data.chartData[0].regionList;
            $scope.subRegionChartData = data.chartData[0].subRegionList;
            $scope.outageYearQuaterChartData = data.chartData[0].outageYearList;
            $scope.tabularData = data.tabularchartDataList;
        }

        var date = new Date();
        var year = date.getFullYear();
        for (var i = 1, j = year - 2; i <= 5; i++, j++) {
            $scope.outageYearData.push({
                id: j
            });
        }

        //Onload Request 
        $scope.getAllData = function () {
            $scope.loading = true;
            DashboardService.getDataByAllYears().then(function (values) {
                $scope.fetchedData = values.data;
                $scope.updateData($scope.fetchedData);
                $scope.$broadcast('getRequest');
                $scope.loading = false;
            });
        }

        $scope.getAllData();

        $scope.clearAllFilters = function () {
            $scope.regionModel = [];
            $scope.subRegionModel = [];
            $scope.platformModel = [];
            $scope.frameSizeModel = [];
            $scope.outagetypeModel = [];
            $scope.customerModel = [];
            $scope.outageYearModel = [];
            $scope.uncheckAllQuaters();
            $scope.getAllData();
            angular.forEach($scope.dataSendObj, function (val, key) {
                $scope.dataSendObj[key] = [];
            })
        }

        $scope.onFilterChange = function (Model, Data, sendObjParam) {
            $scope.loading = true;
            var totalSelected = [];
            angular.forEach(Model, function (val, key) {
                var currentSelected = $filter('filter')(Data, val.id);
                totalSelected.push(currentSelected[currentSelected.length - 1].id);
            })
            $scope.dataSendObj[sendObjParam] = totalSelected;
            angular.forEach($scope.dataSendObj, function (val, key) {
                if (val.length == 0) {
                    if (key == "customer") {
                        $scope.dataSendObj[key] = ["ALL"];
                    } else {
                        var allValues = [];
                        angular.forEach($scope[key + "Data"], function (val, key) {
                            allValues.push(val.id)
                        })
                        $scope.dataSendObj[key] = allValues;
                    }
                }
            })

            DashboardService.getOutageData($scope.dataSendObj).then(function (values) {
                $scope.fetchedData = values.data;                
                $scope.updateData($scope.fetchedData);
                angular.forEach($scope.dataSendObj, function (val, key) {
                    angular.forEach($scope[key + "Model"], function (v, k) {
                        if (key == "outageQuarter") {    
                        } else {
                            if ($filter('filter')($scope[key + "Data"], v.id).length == 0) {
                                var index = $scope[key + "Model"].findIndex(x => x.id == v.id);
                                $scope[key + "Model"].splice(index, 1);
                                index = $scope.dataSendObj[key].indexOf(v.id);
                                $scope.dataSendObj[key].splice(index,1);                                
                            }
                        }
                    })
                })
                $scope.$broadcast('getRequest');                
                $scope.loading = false;
            })
        }

        //Function for Outage Year Filter when the filter values are changed
        $scope.outageSingSelData = function () {
            if ($scope.dataSendObj.outageYear.length < 1) {
                $scope.uncheckAllQuaters();
            }
            $scope.onFilterChange($scope.outageYearModel, $scope.outageYearData, "outageYear");
        }

        $scope.outageMultiSelData = function () {
            if ($scope.dataSendObj.outageYear.length < 1) {
                $scope.uncheckAllQuaters();
            }
            $scope.onFilterChange($scope.outageYearData, $scope.outageYearData, "outageYear");
        }

        $scope.outageMultiDeselData = function () {
            $scope.outageYearModel = [];
            $scope.uncheckAllQuaters();
            $scope.onFilterChange($scope.outageYearModel, $scope.outageYearData, "outageYear");
        }

        $scope.regionSingSelData = function () {
            $scope.onFilterChange($scope.regionModel, $scope.regionData, "region");
        }

        $scope.regionMultiSelData = function () {
            $scope.onFilterChange($scope.regionData, $scope.regionData, "region");
        }

        $scope.regionMultiDeselData = function () {
            $scope.regionModel = [];
            $scope.onFilterChange($scope.regionModel, $scope.regionData, "region");
        }

        $scope.subRegionSingSelData = function () {
            $scope.onFilterChange($scope.subRegionModel, $scope.subRegionData, "subRegion");
        }

        $scope.subRegionMultiSelData = function () {
            $scope.onFilterChange($scope.subRegionData, $scope.subRegionData, "subRegion");
        }

        $scope.subRegionMultiDeselData = function () {
            $scope.subRegionModel = [];
            $scope.onFilterChange($scope.subRegionModel, $scope.subRegionData, "subRegion");
        }

        $scope.platformSingSelData = function () {
            $scope.onFilterChange($scope.platformModel, $scope.platformData, "platform");
        }

        $scope.platformMultiSelData = function () {
            $scope.onFilterChange($scope.platformData, $scope.platformData, "platform");
        }

        $scope.platformMultiDeselData = function () {
            $scope.platformModel = [];
            $scope.onFilterChange($scope.platformModel, $scope.platformData, "platform");
        }

        $scope.frameSizeSingSelData = function () {
            $scope.onFilterChange($scope.frameSizeModel, $scope.frameSizeData, "frameSize");
        }

        $scope.frameSizeMultiSelData = function () {
            $scope.onFilterChange($scope.frameSizeData, $scope.frameSizeData, "frameSize");
        }

        $scope.frameSizeMultiDeselData = function () {
            $scope.frameSizeModel = [];
            $scope.onFilterChange($scope.frameSizeModel, $scope.frameSizeData, "frameSize");
        }

        $scope.outagetypeSingSelData = function () {
            $scope.onFilterChange($scope.outagetypeModel, $scope.outagetypeData, "outagetype");
        }

        $scope.outagetypeMultiSelData = function () {
            $scope.onFilterChange($scope.outagetypeData, $scope.outagetypeData, "outagetype");
        }

        $scope.outagetypeMultiDeselData = function () {
            $scope.outagetypeModel = [];
            $scope.onFilterChange($scope.outagetypeModel, $scope.outagetypeData, "outagetype");
        }

        $scope.customerSingSelData = function () {
            $scope.onFilterChange($scope.customerModel, $scope.customerData, "customer");
        }

        $scope.customerMultiSelData = function () {
            $scope.dataSendObj["customer"] = ["ALL"];
            $scope.loading = true;
            DashboardService.getOutageData($scope.dataSendObj).then(function (values) {
                $scope.fetchedData = values.data;
                $scope.updateData($scope.fetchedData);
                $scope.$broadcast('getRequest');
                $scope.loading = false;
            })
        }

        $scope.customerMultiDeselData = function () {
            $scope.customerModel = [];
            $scope.onFilterChange($scope.customerModel, $scope.customerData, "customer");
        }

        $scope.quaterChange = function (id) {
            $scope.loading = true;
            if ($filter("filter")($scope.outageQuarterData, {
                    id: id
                })[0].val) {
                $scope.outageQuarterModel.push(id);
            } else {
                var index = $scope.outageQuarterModel.indexOf(id);
                $scope.outageQuarterModel.splice(index, 1);
            }
            $scope.dataSendObj.outageQuarter = $scope.outageQuarterModel;
            if ($scope.dataSendObj.outageQuarter.length == 0) {
                var allValues = [];
                angular.forEach($scope.outageQuarterData, function (val, key) {
                    allValues.push(val.id)
                })
                $scope.dataSendObj.outageQuarter = allValues;
            }
            angular.forEach($scope.dataSendObj, function (val, key) {
                if (val.length == 0) {
                    if (key == "customer") {
                        $scope.dataSendObj[key] = ["ALL"];
                    } else {
                        var allValues = [];
                        angular.forEach($scope[key + "Data"], function (val, key) {
                            allValues.push(val.id)
                        })
                        $scope.dataSendObj[key] = allValues;
                    }
                }
            })
            DashboardService.getOutageData($scope.dataSendObj).then(function (values) {
                $scope.fetchedData = values.data;
                $scope.updateData($scope.fetchedData);
                $scope.$broadcast('getRequest');
                $scope.loading = false;
            })
        }

        $scope.uncheckAllQuaters = function () {
            $scope.dataSendObj.outageQuarter = [];
            $scope.outageQuarterModel = [];
            for (var i = 0; i < $scope.outageQuarterData.length; i++) {
                $scope.outageQuarterData[i].val = false;
            }
        }
    }]);
});