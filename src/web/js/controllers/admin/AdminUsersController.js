angular.module('cp.controllers.admin').controller('AdminUsersController',
        ($scope, $cookies, $window, UsersFactory, NotificationService, DocumentTitleService, SecurityService, LoadingService) => {
    DocumentTitleService('Users');
    SecurityService.requireStaff();

    $scope.gridOptions = {
        columnDefs: [
            {
                displayName: 'ID',
                field: 'humanId'
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
                    <a class="view-and-edit" ng-href="/admin/user/{{ row.entity.humanId }}">View and edit</a>
                    <br />
                    <a class="masquerade" ng-click="grid.appScope.masquerade(row.entity.id)">Masquerade</a>
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
        paginationPageSizes: [100, 200, 300],
        paginationPageSize: 100,
        rowHeight: 50
    };

    UsersFactory.getAllUsers().success(response => {
        $scope.gridOptions.data = response.users;
        LoadingService.hide();
    });

    $scope.masquerade = (id) => SecurityService.masqueradeAsUser(id);
});
