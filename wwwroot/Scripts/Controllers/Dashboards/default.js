angular.module("umbraco").controller("TFE.AccessRestrictionController", function ($http, $scope, $route, editorService) {
    var vm = this;

    const API_URL = '/umbraco/backoffice/TFE/IPAccessRestriction/';
    const FORM_IPENTRY = '/App_Plugins/TFE.Umbraco.AccessRestriction/Views/Dialogs/ipEntryForm.html';

    vm.getHeaderInfo = function () {
        $http.get(API_URL + 'GetHeaderInfo/')
            .then(function (response) {
                vm.headerInfo = response.data;
            });
    };

    vm.getHeaderInfo();

    vm.refresh = function () {
        this.getAll();
    };

    vm.getClientIP = function () {
        $http.get(API_URL + 'GetClientIP/')
            .then(function (response) {
                vm.clientIP = response.data;
            });
    };

    vm.getClientIP();

    vm.getAll = function () {
        $http.get(API_URL + 'GetAll/')
            .then(function (response) {
                vm.ipEntries = response.data;
                Update();
            });
    };

    
    vm.getAll();

    vm.take = function (id) {
        $http.get(API_URL + 'GetbyId/' + id)
            .then(function (response) {
                vm.ipEntry = response.data;
            });
    };

    vm.new = function (ip) {
        var options = {
            title: 'New',
            view: FORM_IPENTRY,
            size: 'small',
            data: ip ? { ip: ip } : undefined,
            submit: function () {
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };

        editorService.open(options);
    };

    vm.save = function (id, ip, description) {

        var data = id ? { id: id, ip: ip, description: description } : { ip: ip, description: description };

        $http.post(API_URL + 'Save/', JSON.stringify(data))
            .then(function (response) {
                if (response.data) {
                    $scope.msg = 'Post Data Submitted Successfully!';
                    $route.reload();
                    vm.close();
                }
            }, function (response) {
                $scope.msg = 'Service not Exists';
                $scope.statusval = response.status;
                $scope.statustext = response.statusText;
                $scope.headers = response.headers();
            });
    };

    vm.delete = function (id) {
        $http.get(API_URL + 'Delete/' + id)
            .then(function () {
                $route.reload();
            });
    };

    vm.open = function (id) {   

        var options = {
            title: "Edit",
            view: FORM_IPENTRY,
            data: undefined,
            size: "small",
            submit: function (model) {
                editorService.close();
            },
            close: function () {
                editorService.close();
            }
        };

        $http.get(API_URL + 'GetById/' + id)
            .then(function (response) {
                options.data = response.data;
                editorService.open(options);

            });
    };    

    vm.close = function () {
        if ($scope.model.close) {
            $scope.model.close();
        }
    };

    function Update() {
        var found = false;

        if (vm.ipEntries && vm.clientIP) {
            for (const entry of vm.ipEntries) {
                console.log(entry.ip);
                if (entry.ip == vm.clientIP) {
                    found = true;
                    break;
                }
            }
        }

        vm.myIpNotInList = !found;
    }
});

