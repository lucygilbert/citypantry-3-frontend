describe('VendorQuickRegisterController', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var NotificationService;
    var UsersFactory;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, _NotificationService_, _UsersFactory_) {
        scope = $rootScope.$new();
        UsersFactory = _UsersFactory_;
        NotificationService = _NotificationService_;

        makeCtrl = function () {
            $controller('VendorQuickRegisterController', {
                $scope: scope,
            });
        };

        spyOn(UsersFactory, 'registerVendor').and.returnValue(newPromise());
        spyOn(NotificationService, 'notifyError');
    }));

    it('should not allow the form submission if fields are not all filled', function() {
        scope.vendorSignupForm = {};
        scope.vendorSignupForm.$invalid = true;

        makeCtrl();
        scope.submitSignupForm();

        expect(UsersFactory.registerVendor).not.toHaveBeenCalled();
    });

    it('should make the API call when the form is correctly submitted', function() {
        scope.signupDetails = {
            name: 'Bob',
        };
        scope.vendorSignupForm = {};
        scope.vendorSignupForm.$invalid = false;

        makeCtrl();
        scope.submitSignupForm();

        expect(UsersFactory.registerVendor).toHaveBeenCalled();
        expect(NotificationService.notifyError).not.toHaveBeenCalled();
    });
});
