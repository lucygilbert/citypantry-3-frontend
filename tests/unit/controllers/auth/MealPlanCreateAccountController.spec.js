describe('MealPlanCreateAccountController', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var cookies;
    var LoadingService;
    var NotificationService;
    var UsersFactory;
    var getLoggedInUserHttpRequest;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, $cookies, _LoadingService_, _NotificationService_, _UsersFactory_) {
        scope = $rootScope.$new();
        cookies = $cookies;
        LoadingService = _LoadingService_;
        NotificationService = _NotificationService_;
        UsersFactory = _UsersFactory_;

        makeCtrl = function () {
            $controller('MealPlanCreateAccountController', {
                $scope: scope,
            });
        };
    }));

    describe('create', function() {
        beforeEach(function() {
            spyOn(LoadingService, 'show').and.returnValue();
            spyOn(LoadingService, 'hide').and.returnValue();
            spyOn(NotificationService, 'notifyError');
            spyOn(UsersFactory, 'changeOwnPassword').and.returnValue(newPromise());

            getLoggedInUserHttpRequest = newPromise({id: 'abc123'});
            spyOn(UsersFactory, 'getLoggedInUser').and.returnValue(getLoggedInUserHttpRequest);
        });

        it('should set a cookie value to persist authentication', function() {
            makeCtrl();
            getLoggedInUserHttpRequest.resolveSuccess({
                user: {
                    id: 'abc123'
                }
            });

            expect(UsersFactory.getLoggedInUser).toHaveBeenCalled();
            expect(scope.user).toEqual({id: 'abc123'});
            expect(cookies.userId).toBe('abc123');
            expect(NotificationService.notifyError).not.toHaveBeenCalled();
        });

        it('should call UsersFactory.changeOwnPassword with new password and current password', function() {
            scope.newPassword = 'password';
            scope.confirmPassword = 'password';

            makeCtrl();
            scope.create();

            expect(UsersFactory.changeOwnPassword.calls.mostRecent().args)
                .toEqual([{newPassword: 'password', currentPassword: null}]);
        });
    });
});
