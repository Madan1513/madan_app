define(['app', 'html2canvas', 'googleMap', 'heatmap', 'treemap', 'customEvents', 'exporting', 'dom2image', 'DashboardService'], function (app, html2canvas) {
    app.controller('MyForecastCtrl', ['$scope', '$state', '$filter', '$compile', 'DashboardService', function ($scope, $state, $filter, $compile, DashboardService) {
        $scope.showVolumeSaving = false;

        Highcharts.setOptions(Highcharts.theme);

        $scope.sortType = 'region'; // set the default sort type
        $scope.sortReverse = false; // set the default sort order

        $scope.currentPage = 0;
        $scope.pageSize = "10";

        $scope.q = '';

        $scope.getData = function () {
            return $filter('filter')($scope.tabularData, $scope.q);
        }

        $scope.numberOfPages = function () {
            if ($scope.tabularData != undefined) {
                return Math.ceil($scope.getData().length / $scope.pageSize);
            } else {
                return 0;
            }
        }

        $scope.resetCurrentPage = function () {
            $scope.currentPage = 0;
        }

        $scope.appliedFilters = {
            "outageYear": "",
            "outageQuarter": "",
            "region": "",
            "subRegion": "",
            "platform": "",
            "frameSize": "",
            "outagetype": "",
            "customer": ""
        }

        //Google Maps
        var markers = {
            "Outages": [],
            "ApprovedVendors": [],
            "QualifiedVendors": []
        };

        $scope.infoWindow = new google.maps.InfoWindow();
        $scope.mapProp = {
            center: new google.maps.LatLng(30.508742, -0.120850),
            zoom: 2,
            streetViewControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapProp);

        $scope.collapseCheck = 0;
        $scope.resizeMap = function () {
            google.maps.event.trigger($scope.map, "resize"); // resize map
            $scope.map.setCenter(new google.maps.LatLng(30.508742, -0.120850));
        }

        $scope.expand = function (element) {
            if ($scope.collapseCheck == 0) {
                // setMapZoom(30.508742, -0.120850, 2);
                $("#collapse2").slideDown($scope.resizeMap);
                $scope.collapseCheck = 1;
            } else {
                $("#collapse2").slideUp();
                $scope.collapseCheck = 0;
            }
        }

        function setMapZoom(lati, long, zoom) {
            $scope.map.setZoom(zoom);
            $scope.map.setCenter(new google.maps.LatLng(lati, long));
        }


        function addPositions(arr, col, type) {
            for (var i = 0; i < arr.length; i++) {
                addMarker(arr[i], col, type);
            }
        }

        function addMarker(position, color, type) {
            var popup = {
                customer: "",
                framesize: "",
                fspErpProjectid: "",
                outage_type: "",
                platform: "",
                site: "",
                turbineSerial: "",
                html: "",
                outageId: ""
            }
            // var customer = "";
            // var framesize = "";
            // var fspErpProjectid = "";
            // var outage_type = "";
            // var platform = "";
            // var site = "";
            // var turbineSerial = "";
            // var html = "";
            // var
            if (color == "red") {
                popup.customer = position.customer;
                popup.framesize = position.frameSize;
                popup.fspErpProjectid = position.fspErpProjectId;
                popup.outage_type = position.outageType;
                popup.platform = position.platform;
                popup.site = position.site;
                popup.turbineSerial = position.turbineSerial;
                popup.outageId = position.pgsOutageID;
                popup.html = "<b>Customer:</b>&nbsp;" + popup.customer + " <br/><b>Site:</b>&nbsp;" + popup.site + "<br/><b>Turbine Serial #:</b>&nbsp;" + popup.turbineSerial + "<br/><b>Frame size:</b>&nbsp;" + popup.framesize + "<br/><b>Platform:</b>&nbsp;" + popup.platform + "<br/><b>Outage type:</b>&nbsp;" + popup.outage_type + "<br/><b>FSP ERP Outage Id:</b>&nbsp;" + popup.fspErpProjectid + "<br/><b>BOM:</b>&nbsp;<a data-toggle='modal' data-target='#BomData' class='showDetails' ng-click='displayBomDetails(\"" + popup.outageId + "\")'>Show Details</a>";
            }
            /*else if (color == "blue") {
                name = position.vendorName;
                address = position.gslSite;
                details = position.sourceSystem;
                html = "<b>" + name + "</b> <br/>" + address + "<br/>" + details;
            } else if (color == "green") {
                name = position.supplierName;
                address = position.gslSite;
                details = position.commodityname;
                html = "<b>" + name + "</b> <br/>" + address + "<br/>" + details;
            }*/
            var marker = new google.maps.Marker({
                position: position,
                map: $scope.map,
                icon: 'https://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png',
                type: type
            })
            markers[type].push(marker);
            bindInfoWindow(marker, $scope.map, $scope.infoWindow, popup.html);
        }

        $scope.displayBomDetails = function (outageId) {
            DashboardService.getBOMData(outageId).then(function (values) {
                $scope.bomData = values.data;
            });
        }

        function bindInfoWindow(marker, map, infoWindow, html) {
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent(html);
                infoWindow.open(map, marker);
                $compile(document.getElementsByClassName('showDetails')[0])($scope);
            });
        }

        $scope.clearMarkers = function () {
            angular.forEach(markers, function (v, k) {
                for (var i = 0; i < v.length; i++) {
                    v[i].setMap(null);
                }
            })
        }
        // $compile(popup.html)($scope);

        // // $scope.toggleGroup = function(check, type) {
        // //     for (var i = 0; i < markers[type].length; i++) {
        // //         var marker = markers[type][i];
        // //         if (check) {
        // //             marker.setVisible(true);
        // //         } else {
        // //             marker.setVisible(false);
        // //         }
        // //     }
        // // }

        $scope.$on('getRequest', function (e) {
            $scope.clearMarkers();
            addPositions($scope.outages, "red", "Outages");
            if ($scope.regionModel.length == 1) {
                if ($scope.regionModel[0].id == "ASIA") {
                    setMapZoom(34.0479, 100.6197, 3);
                } else if ($scope.regionModel[0].id == "EUROPE") {
                    setMapZoom(54.5260, 15.2551, 3);
                } else if ($scope.regionModel[0].id == "LATIN AMERICA") {
                    setMapZoom(-20, -60, 3);
                } else if ($scope.regionModel[0].id == "CHINA") {
                    setMapZoom(35.8617, 104.1954, 4);
                } else if ($scope.regionModel[0].id == "INDIA") {
                    setMapZoom(22.5937, 78.9629, 4);
                } else if ($scope.regionModel[0].id == "MEA") {
                    setMapZoom(10, 40, 3);
                } else if ($scope.regionModel[0].id == "NORTH AMERICA") {
                    setMapZoom(48.5260, -105.2551, 3);
                }
            } else {
                setMapZoom(30.508742, -0.120850, 2);
            }
            $scope.drawOutageYearandQuarterChart('outageYearandQuarter', 250);
            $scope.drawPlatformChart('platformChart', 250);
            $scope.drawOutageTypeChart('outageTypeChart', 250);
            $scope.drawFrameSizeChart('frameSizeChart', 250);
            $scope.drawRegionChart('regionChart', 250);
            $scope.drawSubRegionChart('subRegionChart', 250);

            //Applied filter
            $scope.appliedFilters = {
                "outageYear": "",
                "outageQuarter": "",
                "region": "",
                "subRegion": "",
                "platform": "",
                "frameSize": "",
                "outagetype": "",
                "customer": ""
            }
            angular.forEach($scope.appliedFilters, function (val, key) {
                if (key == "outageQuarter") {
                    angular.forEach($scope.outageQuarterModel, function (v, k) {
                        if ($scope.appliedFilters[key] == "") {
                            $scope.appliedFilters[key] += v
                        } else {
                            $scope.appliedFilters[key] += ";" + v
                        }
                    })
                } else {
                    checkForAllModel($scope[key + "Model"]);
                }


                function checkForAllModel(Model) {
                    angular.forEach(Model, function (v, k) {
                        if ($scope.appliedFilters[key] == "") {
                            $scope.appliedFilters[key] += v.id
                        } else {
                            $scope.appliedFilters[key] += ";" + v.id
                        }
                    })
                }
                $scope.appliedFilters[key] = $scope.appliedFilters[key].split(";");
                var x = document.getElementById("apply-filters");

                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.isOverflow = x.clientWidth < x.scrollWidth;
                    });
                }, 100);
            })

            //Clear a single Filter in Applied Filter
            $scope.clearFilter = function (deletedValue, value) {
                var index = $scope[value + "Model"].findIndex(x => x.id == deletedValue);
                if (value == "outageQuarter") {
                    $filter("filter")($scope.outageQuarterData, {
                        id: deletedValue
                    })[0].val = false;
                    $scope.quaterChange(deletedValue);
                } else {
                    $scope.$parent[value + "Model"].splice(index, 1);
                    $scope.onFilterChange($scope.$parent[value + "Model"], $scope.$parent[value + "Data"], value)
                }
            }
            //End of Applied Filters

        });

        $scope.JSONToCSVConvertor = function (JSONData, ReportTitle, ShowLabel) {
            //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
            if (JSONData != undefined) {

                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
                var CSV = '';
                //Set Report title in first row or line

                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var row = "";

                    //This loop will extract the label from 1st index of on array
                    for (var index in arrData[0]) {

                        //Now convert each value to string and comma-seprated
                        if (index == "pgsOutageId") {
                            row += "Outage ID" + ',';
                        } else if (index == "$$hashKey") {} else if (index == "pgsOutageID") {
                            row += "Outage_ID" + ',';
                        } else if (index == "site") {
                            row += "Site_Name" + ',';
                        } else if (index == "turbineSerial") {
                            row += "Turbine_Serial_Number" + ',';
                        } else if (index == "frameSize") {
                            row += "Frame_Size" + ',';
                        } else if (index == "outageType") {
                            row += "Outage_Type" + ',';
                        } else if (index == "fspErpProjectId") {
                            row += "FSP_ERP_PROJECT_ID" + ',';
                        } else if (index == "platform") {
                            row += "Platform" + ',';
                        } else if (index == "lng") {
                            row += "Longitude" + ',';
                        } else if (index == "lat") {
                            row += "Latitude" + ',';
                        } else if (index == "customer") {
                            row += "Customer_Name" + ',';
                        } else {
                            row += index + ',';
                        }
                    }

                    row = row.slice(0, -1);

                    //append Label row with line break
                    CSV += row + '\r\n';
                }

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        if (index != "$$hashKey") {
                            if (arrData[i][index] == null) {
                                arrData[i][index] = "";
                            }
                            row += '"' + arrData[i][index] + '",';
                        }
                    }
                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                var blobdata = new Blob([CSV], {
                    type: 'text/csv'
                });

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.setAttribute("href", window.URL.createObjectURL(blobdata));

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = ReportTitle + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }

        $scope.downloadOutageYearandQuarterChartData = function () {
            var OutageYearandQuarterChartDataTemp = [];
            angular.forEach($scope.outageYearQuaterChartData, function (data) {
                var Temp = {};
                Temp['Year'] = data.year;
                angular.forEach(data.quarters, function (values) {
                    if (values.name == "Q1") {
                        Temp['Q1'] = values.count;
                    } else if (values.name == "Q2") {
                        Temp['Q2'] = values.count;
                    } else if (values.name == "Q3") {
                        Temp['Q3'] = values.count;
                    } else if (values.name == "Q4") {
                        Temp['Q4'] = values.count;
                    }
                })
                OutageYearandQuarterChartDataTemp.push(Temp);
            })
            $scope.JSONToCSVConvertor(OutageYearandQuarterChartDataTemp, 'Outage year and quarter chart data', true);
        }

        $scope.chartClicked = function (chartType, value, model, data) {
            $scope.$parent[model] = [{
                id: value
            }];
            $scope.onFilterChange($scope.$parent[model], $scope.$parent[data], chartType);
        };

        $scope.fullScreenChart = function (functionType, id, oldId, height, header) {
            $scope[functionType](id, height);
            $scope.chartTitle = header;
            document.getElementById('closeFullScreenChart').setAttribute("ng-click", "closeFullScreenChart('" + functionType + "','" + oldId + "','250')");
            $compile(document.getElementById('closeFullScreenChart'))($scope);
        }

        $scope.closeFullScreenChart = function (functionType, id, height) {
            $scope[functionType](id, height);
        }

        $scope.PDFExport = {}
        $scope.exportPDFChart = function (chart, fileName) {
            $scope.PDFExport[chart].exportChart({
                type: 'image/jpeg',
                filename: fileName
            });
        }

        $scope.takeScreenShot = function (id, fileName) {
            if (id == 'chartsID') {
                domtoimage.toJpeg(document.getElementById(id), {
                        quality: 0.95
                    })
                    .then(function (dataUrl) {
                        var link = document.createElement('a');
                        link.download = fileName + '.jpg';
                        link.href = dataUrl;
                        link.click();
                    });
            } else {
                html2canvas($("#" + id), {
                    useCORS: true,
                    onrendered: function (canvas) {
                        var link = document.createElement("a");
                        link.href = canvas.toDataURL("image/png");
                        link.download = fileName + '.jpg';
                        link.click();
                    }
                });
            }
        };

        $scope.exportMap = function () {
            debugger
            //URL of Google Static Maps.
            var staticMapUrl = "https://maps.googleapis.com/maps/api/staticmap";

            //Set the Google Map Center.
            staticMapUrl += "?center=" + $scope.mapProp.center.lat() + "," + $scope.mapProp.center.lng();
            // staticMapUrl += "?center=" + $scope.mapProp.center;

            //Set the Google Map Size.
            staticMapUrl += "&size=1327x390";

            //Set the Google Map Zoom.
            staticMapUrl += "&zoom=" + $scope.mapProp.zoom;

            //Set the Google Map Type.
            // staticMapUrl += "&maptype=" + mapOptions.mapTypeId;

            //Loop and add Markers.
            for (var i = 0; i < $scope.outages.length; i++) {
                staticMapUrl += "&markers=color:red|" + $scope.outages[i].lat + "," + $scope.outages[i].lng;
            }

            //Display the Image of Google Map.
            var imgMap = document.getElementById("map");
            var link = document.createElement("a");
            imgMap.src = staticMapUrl;
            imgMap.style.display = "block";
        }

        $scope.drawOutageYearandQuarterChart = function (id, height) {
            Highcharts.setOptions({
                colors: ['#004080', '#005EB8', '#00B5E2', '#72cbe1']
            });
            var chartData = {
                categories: [],
                Q1: [],
                Q2: [],
                Q3: [],
                Q4: []
            };
            for (i = 0; i < $scope.outageYearQuaterChartData.length; i++) {
                chartData.Q1.push(null);
                chartData.Q2.push(null);
                chartData.Q3.push(null);
                chartData.Q4.push(null);
            }
            $scope.$parent.outageYearQuaterChartData = $filter('orderBy')($scope.outageYearQuaterChartData, 'year');
            angular.forEach($scope.outageYearQuaterChartData, function (v, k) {
                chartData.categories.push(v.year);
                angular.forEach(v.quarters, function (val, key) {
                    if (val.name == "Q1") {
                        chartData.Q1[k] = val.count;
                    }
                    if (val.name == "Q2") {
                        chartData.Q2[k] = val.count;
                    }
                    if (val.name == "Q3") {
                        chartData.Q3[k] = val.count;
                    }
                    if (val.name == "Q4") {
                        chartData.Q4[k] = val.count;
                    }
                })
            })
            var outageYearandQuarterChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: id,
                    backgroundColor: '#fff',
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: chartData.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Number of Outages'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        },
                        formatter: function () {
                            return Highcharts.numberFormat((this.total / 1), 0, ".", ",");
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -10,
                    verticalAlign: 'top',
                    y: 0,
                    floating: false,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.key + '</b><br/>' + this.series.name + ': ' + Highcharts.numberFormat((this.point.y / 1), 0, ".", ",") + '<br/>Total: ' + Highcharts.numberFormat((this.point.stackTotal / 1), 0, ".", ",");
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textOutline: "0px"
                            },
                            formatter: function () {
                                return Highcharts.numberFormat((this.y / 1), 0, ".", ",");
                            }
                        },
                        point: {
                            events: {
                                click: function () {
                                    for (var i = 0; i < $scope.$parent.outageQuarterData.length; i++) {
                                        $scope.$parent.outageQuarterData[i].val = false;
                                    }
                                    $scope.$parent.outageQuarterModel = [];
                                    $scope.$parent.dataSendObj.outageQuarter = [];
                                    $filter("filter")($scope.outageQuarterData, {
                                        id: this.series.name
                                    })[0].val = true;
                                    $scope.chartClicked("outageYear", this.category, "outageYearModel", "outageYearData");
                                    $scope.quaterChange(this.series.name);
                                }
                            }
                        }
                    }
                },
                series: [{
                        name: 'Q1',
                        data: chartData.Q1
                    },
                    {
                        name: 'Q2',
                        data: chartData.Q2
                    },
                    {
                        name: 'Q3',
                        data: chartData.Q3
                    },
                    {
                        name: 'Q4',
                        data: chartData.Q4
                    }
                ],
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                annotationsOptions: {
                    enabledButtons: false
                }

            });
            $scope.PDFExport.outageYearandQuarterChart = outageYearandQuarterChart;
        }

        $scope.drawPlatformChart = function (id, height) {
            Highcharts.setOptions({
                colors: ['#13294b', '#a5a6a8', '#fe5000', '#00bf6f', '#D7D8DB', '#2F3133', '#7BEFB2', '#72CBE1', '#13294B']
            });
            var chartData = [];
            angular.forEach($scope.platformChartData, function (v, k) {
                chartData.push([v.name, v.count]);
            })
            var platformChart = new Highcharts.Chart({
                chart: {
                    type: 'pie',
                    renderTo: id,
                    backgroundColor: '#fff',
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                title: {
                    text: ''
                },
                yAxis: {
                    title: {
                        text: 'Total percent market share'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false
                    },
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    $scope.chartClicked("platform", this.name, "platformModel", "platformData");
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return this.point.name + '<br/>Outage Count: <b>' + Highcharts.numberFormat((this.y / 1), 0, ".", ",") + '</b>';
                    }
                },
                series: [{
                    name: 'Browsers',
                    data: chartData,
                    size: '60%',
                    innerSize: '50%',
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                }],
                legend: {
                    enabled: true,
                    floating: true,
                    layout: 'vertical',
                    align: 'right',
                    width: 150,
                    verticalAlign: 'bottom',
                    useHTML: true,
                    labelFormatter: function () {
                        return '<div style="text-align: left; width:130px;">' + this.name + '</div>';
                    }
                },
                credits: {
                    enabled: false
                },

                exporting: {
                    enabled: false
                },

                annotationsOptions: {
                    enabledButtons: false
                }

            })
            $scope.PDFExport.platformChart = platformChart;
        }

        $scope.drawFrameSizeChart = function (id, height) {
            Highcharts.setOptions({
                colors: ['#64bd63']
            });
            var chartData = [];
            $scope.$parent.frameSizeChartData = $filter('orderBy')($scope.frameSizeChartData, 'count', true);
            angular.forEach($scope.frameSizeChartData, function (v, k) {
                chartData.push([v.name, v.count]);
            })
            var frameSizeChart = new Highcharts.Chart({
                chart: {
                    type: 'bar',
                    renderTo: id,
                    backgroundColor: '#fff',
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: null
                    },
                    min: 0,
                    max: chartData.length > 8 ? 7 : chartData.length - 1,
                    scrollbar: {
                        enabled: chartData.length > 8 ? true : false
                    },
                    tickLength: 0
                },
                plotOptions: {
                    series: {
                        cropThreshold: 150,
                        point: {
                            events: {
                                click: function () {
                                    $scope.chartClicked("frameSize", this.name, "frameSizeModel", "frameSizeData");
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return this.point.name + '<br/>Outage Count: <b>' + Highcharts.numberFormat((this.y / 1), 0, ".", ",") + '</b>';
                    }
                },
                series: [{
                    data: chartData
                }],
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                annotationsOptions: {
                    enabledButtons: false
                }
            })
            $scope.PDFExport.frameSizeChart = frameSizeChart;
        }

        $scope.drawOutageTypeChart = function (id, height) {
            var chartData = [];
            var count = 1;
            $scope.$parent.outageTypeChartData = $filter('orderBy')($scope.outageTypeChartData, 'count');
            angular.forEach($scope.outageTypeChartData, function (v, k) {
                chartData.push({
                    'name': v.name,
                    'value': v.count,
                    'colorValue': count
                })
                count++;
            })
            var outageTypeChart = new Highcharts.Chart({
                chart: {
                    renderTo: id,
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                colorAxis: {
                    minColor: '#b9ebf7',
                    maxColor: '#005eb8'
                },
                series: [{
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    data: chartData
                }],
                title: {
                    text: ''
                },
                plotOptions: {
                    series: {
                        point: {
                            events: {
                                click: function () {
                                    $scope.chartClicked("outagetype", this.name, "outagetypeModel", "outagetypeData");
                                }
                            }
                        }
                    }
                },
                tooltip: {
                    formatter: function () {
                        return this.point.name + '<br/>Outage Count: <b>' + Highcharts.numberFormat((this.point.value / 1), 0, ".", ",") + '</b>';
                    }
                },
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                annotationsOptions: {
                    enabledButtons: false
                }
            })
            $scope.PDFExport.outageTypeChart = outageTypeChart;
        }

        $scope.drawRegionChart = function (id, height) {
            Highcharts.setOptions({
                colors: ['#7aabda']
            });
            var chartData = [];
            $scope.$parent.regionChartData = $filter('orderBy')($scope.regionChartData, 'name');
            angular.forEach($scope.regionChartData, function (v, k) {
                chartData.push([v.name, v.count]);
            })
            var regionChart = new Highcharts.Chart({
                chart: {
                    type: 'bar',
                    renderTo: id,
                    backgroundColor: '#fff',
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        text: 'Outages Count'
                    }
                },
                plotOptions: {
                    series: {
                        cropThreshold: 150,
                        point: {
                            events: {
                                click: function () {
                                    $scope.chartClicked("region", this.name, "regionModel", "regionData");
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return this.point.name + '<br/>Outage Count: <b>' + Highcharts.numberFormat((this.y / 1), 0, ".", ",") + '</b>';
                    }
                },
                series: [{
                    data: chartData
                }],
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                annotationsOptions: {
                    enabledButtons: false
                }
            })
            $scope.PDFExport.regionChart = regionChart;
        }

        $scope.drawSubRegionChart = function (id, height) {
            Highcharts.setOptions({
                colors: ['#64bd63']
            });
            var chartData = [];
            $scope.$parent.subRegionChartData = $filter('orderBy')($scope.subRegionChartData, 'name');
            angular.forEach($scope.subRegionChartData, function (v, k) {
                chartData.push([v.name, v.count]);
            })
            var subRegionChart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: id,
                    backgroundColor: '#fff',
                    height: height,
                    style: {
                        fontFamily: 'GE Inspira Sans'
                    }
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'category',
                    title: {
                        text: null
                    },
                    labels: {
                        rotation: -90
                    },
                    min: 0,
                    max: chartData.length > 30 ? 29 : chartData.length - 1,
                    scrollbar: {
                        enabled: chartData.length > 30 ? true : false
                    },
                    tickLength: 0
                },
                yAxis: {
                    title: {
                        text: 'Outages Count'
                    }
                },
                plotOptions: {
                    series: {
                        cropThreshold: 150,
                        point: {
                            events: {
                                click: function () {
                                    $scope.chartClicked("subRegion", this.name, "subRegionModel", "subRegionData");
                                }
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        return this.point.name + '<br/>Outage Count: <b>' + Highcharts.numberFormat((this.y / 1), 0, ".", ",") + '</b>';
                    }
                },
                series: [{
                    data: chartData
                }],
                credits: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                annotationsOptions: {
                    enabledButtons: false
                }
            })
            $scope.PDFExport.subRegionChart = subRegionChart;
        }
    }]);

    angular.module('app')
        .filter('startFrom', function () {
            return function (input, start) {
                if (input != undefined) {
                    start = +start; //parse to int
                    return input.slice(start);
                } else {
                    return [];
                }
            }
        });
});