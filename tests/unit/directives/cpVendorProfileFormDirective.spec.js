describe('cpVendorProfileForm directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        makeCtrl = function () {
            $controller('cpVendorProfileFormController', {
                $scope: scope,
            });
        };

        scope.vendor = {
            images: [
                'test',
                'test2',
                'test3',
            ],
        };
    }));

    it('should be able to set an image as the cover photo', function() {
        makeCtrl();

        scope.setCoverImage(1);

        expect(scope.vendor.images[0]).toBe('test2');
    });

    it('should be able to delete an image', function() {
        makeCtrl();

        scope.deleteImage(1);

        expect(scope.vendor.images.length).toBe(2);
        expect(scope.vendor.images[0]).toBe('test');
        expect(scope.vendor.images[1]).toBe('test3');
    });
});
