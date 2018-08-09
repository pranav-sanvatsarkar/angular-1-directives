var tableDemoApp = angular.module('tableDemoApp', []);
tableDemoApp.service('$dataService', function ($q, $filter) {
    this.getData = function () {
        return $q(function (resolve, reject) {
            fetch('http://localhost/angular-1-directives/data/data.json').then(function (res) {
                return res.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject('Error');
            });
        });
    }
    this.getConfig = function () {
        return $q(function (resolve, reject) {
            fetch('http://localhost/angular-1-directives/data/config.json').then(function (res) {
                return res.json();
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject('Error');
            });
        });
    }
    this.drawTable = function (config, data) {

        var table = document.createElement('table');
        table.setAttribute('id', 'tableOne');
        table.setAttribute('class', 'dataTable slds-table slds-table_bordered slds-table_cell-buffer"');
        // adding header
        var thead = document.createElement('thead');
        var tr = document.createElement('tr');
        tr.setAttribute('class', 'slds-text-title_caps');

        if (config.actions) {
            var td = document.createElement('td');
            td.setAttribute('colspan', config.actions.length);
            var div = document.createElement('div');
            div.setAttribute('class', 'slds-truncate');
            div.setAttribute('title', 'Actions');
            div.innerHTML = 'Actions';
            td.appendChild(div);
            tr.appendChild(td);

        }

        config.fields.forEach(function (con) {
            var td = document.createElement('td');
            var div = document.createElement('div');
            div.setAttribute('class', 'slds-truncate');
            div.setAttribute('title', con.label);
            div.innerHTML = con.label;
            td.appendChild(div);
            tr.appendChild(td);
        });
        thead.appendChild(tr);
        table.appendChild(thead);
        // adding body
        var tbody = document.createElement('tbody');
        data.forEach(row => {
            var tr = document.createElement('tr');

            if (config.actions) {
                config.actions.forEach((action) => {
                    var td = document.createElement('td');
                    td.setAttribute('style', 'text-align: center');
                    var image = document.createElement('img');
                    image.setAttribute('src', 'http://localhost/angular-1-directives/static_resources/vendor_css/slds/icons/utility/' + action.icon + '_60.png');
                    image.setAttribute('title', action.label);

                    callbackParam = {};
                    callbackParam.action = action.callback;
                    callbackParam.record = row;

                    image.setAttribute('ng-click', action.callback + '(\'' + JSON.stringify(callbackParam) + '\');');
                    td.appendChild(image);
                    tr.appendChild(td);
                });
            }

            config.fields.forEach(field => {
                var td = document.createElement('td');
                if (!field.type)
                    td.innerHTML = row[field.api_name];
                else {
                    if (field.type && field.type == 'date')
                        td.innerHTML = $filter('date')(row[field.api_name], 'fullDate', 'PST');
                    if (field.type && field.type == 'boolean') {
                        var checkbox = document.createElement('input');
                        checkbox.setAttribute('type', 'checkbox');
                        if (row[field.api_name] == 'true' || row[field.api_name] == true)
                            checkbox.setAttribute('checked', 'true');
                        td.appendChild(checkbox);
                    }
                }
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        return table;
    }
});
tableDemoApp.controller('tableDemoAppController', function ($scope, $compile, $dataService) {
    $scope.data;
    $scope.config;

    $scope.edit = function (selectedItem) {
        alert('Inside edit - ' + selectedItem);
    }

    $scope.view = function (selectedItem) {
        alert('Inside view - ' + selectedItem);
    }

    $dataService.getConfig().then(function (result) {
        $scope.config = result;
        for (var index = 0; index < result.actions.length; index++) {
            $scope.config.actions[index].callback = $scope.config.actions[index].name;
        }
        $dataService.getData().then(function (result) {
            $scope.data = [];
            for (var index = 0; index < result.length; index++) {
                $scope.data[index] = result[index];
                if (index > 8)
                    break;
            }
            var table = $dataService.drawTable($scope.config, $scope.data);
            var tableContainer = document.getElementById('tableContainer');
            tableContainer.appendChild(table);
            $compile(table)($scope);
            setTimeout(() => {
                $("table").DataTable();
            }, 2000);
        }).catch(function (error) {
            console.log('Exception: ' + error);
        });
    }).catch(function (error) {
        console.log('Exception: ' + error);
    });
});