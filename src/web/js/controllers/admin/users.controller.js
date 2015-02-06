angular.module('cp.controllers.admin').controller('AdminUsersController',
        ($scope, $cookies, $window, UsersFactory, NotificationService, DocumentTitleService, SecurityService) => {
    DocumentTitleService('Users');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'id'
            },
            {
                displayName: 'Name',
                field: 'name'
            },
            {
                displayName: 'Email',
                field: 'email'
            },
            {
                displayName: 'Group',
                field: 'group.description'
            },
            {
                displayName: 'Last Login',
                field: 'lastLogin',
                enableFiltering: false,
                cellFilter: 'date:\'d MMM yyyy H:mm\''
            },
            {
                cellTemplate: `<div class="ui-grid-cell-contents">
                    <a class="masquerade" ng-click="grid.appScope.masquerade(row.entity[col.field])">Masquerade</a>
                    </div>
                    `,
                displayName: 'Action',
                field: 'id',
                name: ' ',
                enableFiltering: false
            }
        ],
        enableFiltering: true,
        enableSorting: true,
        paginationPageSizes: [25, 50, 75],
        paginationPageSize: 25
    };

    UsersFactory.getAllUsers().success(response => {
        $scope.gridOptions.data = response.users;
    });

    $scope.masquerade = function(id) {
        UsersFactory.masqueradeAsUser(id)
            .success(response => {
                $cookies.userId = response.apiAuth.userId;
                $cookies.salt = response.apiAuth.salt;
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $window.location = '/';
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
