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

        it('should set cookie values to persist authentication', function() {
            makeCtrl();
            getLoggedInUserHttpRequest.resolveSuccess({
                user: {
                    id: 'abc123'
                },
                apiAuth: {
                    userId: 'abc123',
                    salt: 'salty'
                }
            });

            expect(UsersFactory.getLoggedInUser).toHaveBeenCalled();
            expect(scope.user).toEqual({id: 'abc123'});
            expect(cookies.userId).toBe('abc123');
            expect(cookies.salt).toBe('salty');
            expect(NotificationService.notifyError).not.toHaveBeenCalled();
        });

        it('should call UsersFactory.changeOwnPassword with the new password', function() {
            scope.newPassword = 'password';
            scope.confirmPassword = 'password';

            makeCtrl();
            scope.create();

            expect(UsersFactory.changeOwnPassword.calls.mostRecent().args)
                .toEqual([{newPassword: 'password'}]);
        });

        it('should not call UsersFactory.changeOwnPassword with the new password if the confirmed password does not match', function() {
            scope.newPassword = 'password';
            scope.confirmPassword = 'not indentical';

            makeCtrl();
            scope.create();

            expect(UsersFactory.changeOwnPassword).not.toHaveBeenCalled();
            expect(NotificationService.notifyError).toHaveBeenCalled();
            expect(scope.newPassword).toBe('');
            expect(scope.confirmPassword).toBe('');
        });
    });
});
