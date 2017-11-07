define(['app'], function (app) {
    app.controller('AdminCtrl', ['$scope', '$state', '$http', '$timeout', function ($scope, $state, $http, $timeout) {
        $scope.userDetails = [];
        $scope.val = {};
        $scope.valcopy = {};
        $scope.flagd = false;
        $scope.deleteId = '';
        $scope.orderssoid = true;
        $scope.orderlname = true;
        $scope.getDetails = function () {
            $http.get("http://localhost:7000/periscope/listalluserinfo").then(function (response) {
                $scope.userDetails = response.data;
            });
        }

        $scope.hideUserMessage = function(){
            $timeout(function(){
                $scope.showUserMessage = false;
             }, 10000);
        }

        $scope.showUserMessage = false;

        $scope.addUser = function (obj) {    
            var newUser = obj;
            newUser.active = 'YES';
            newUser.roleDescription = 'READ/WRITE';
            $http.post('http://localhost:7000/periscope/adduserinfo', newUser).then(function (response) {
                if (response.data) {
                    $scope.getDetails();
                    $scope.val = {};
                    $scope.showUserMessage = true;
                    $scope.userMessage = "User added successfully.";
                    $scope.hideUserMessage();                    
                }
            });
            $scope.valcopy = angular.copy(obj);
        }
        $scope.addUserModal = function(){
            $scope.val = {};
            $scope.flagd = false;
        }
        $scope.editUser = function (upobj) {
            $scope.val = upobj;
            $scope.flagd = true;
            $scope.valcopy = angular.copy(upobj);
            
        }
        $scope.updateUser = function (obj) {
            var newUser = obj;
            newUser.active = 'YES';
            newUser.roleDescription = 'READ/WRITE';
            $http.post('http://localhost:7000/periscope/updateuserinfo', newUser).then(function (response) {
                if (response.data) {
                    $scope.getDetails();
                    $scope.val = {};
                    $scope.showUserMessage = true;
                    $scope.userMessage = "User data updated successfully.";
                    $scope.hideUserMessage();
                }
            });
        }

        $scope.updateUserA = function (obj) {
            var newUserActive = {};
            newUserActive.active = obj.active;
            newUserActive.ssoID = obj.ssoID;
            newUserActive.firstName = obj.firstName;
            newUserActive.lastName = obj.lastName;
            newUserActive.emailAddress = obj.emailAddress;
            newUserActive.roleName = obj.roleName;
            if (newUserActive.active == 'YES') {
                newUserActive.active = 'NO';
            } else {
                newUserActive.active = 'YES';
            }

            newUserActive.roleDescription = 'READ/WRITE';
            $http.post('http://localhost:7000/periscope/updateuserinfo', newUserActive).then(function (response) {
                if (response.data) {
                    $scope.getDetails();
                    $scope.showUserMessage = true;
                    $scope.userMessage = "User activation status updated successfully.";
                    $scope.hideUserMessage();
                }
            });
        }

        $scope.resetForm = function () {
            $scope.val = angular.copy($scope.valcopy);
            $scope.ssoid = $scope.valcopy.ssoID;
        }

        $scope.deleteUser1 = function (id) {
            $scope.deleteId = id;
        }
        $scope.deleteUser = function (id) {
            $http.post('http://localhost:7000/periscope/deleteuserinfo', {
                'ssoID': id
            }).then(function (response) {
                if (response.data) {
                    $scope.getDetails();
                    $scope.showUserMessage = true;
                    $scope.userMessage = "User deleted successfully.";
                    $scope.hideUserMessage();
                }
            });
        }
        $scope.getDetails();

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
                        if (index == "ssoID") {
                            row += "SSO ID" + ',';
                        } else if (index == "$$hashKey") {                            
                        } else if (index == "firstName") {
                            row += "First Name" + ',';
                        } else if (index == "lastName") {
                            row += "Last Name" + ',';
                        } else if (index == "emailAddress") {
                            row += "E-mail Address" + ',';
                        } else if (index == "active") {
                            row += "Active" + ',';
                        } else if (index == "roleName") {
                            row += "Role Name" + ',';
                        } else if (index == "roleDescription") {
                            row += "Role Description" + ',';
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
    }]);
});