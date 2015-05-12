describe('cpPackageForm directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var PackagesFactory;

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope, _PackagesFactory_) {
        scope = $rootScope.$new();
        PackagesFactory = _PackagesFactory_;

        makeCtrl = function () {
            $controller('cpPackageFormController', {
                $scope: scope,
            });
        };

        scope.package = {
            isMealPlan: true,
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

        expect(scope.package.images[0]).toBe('test2');
    });

    it('should be able to delete an image', function() {
        makeCtrl();

        scope.deleteImage(0);

        expect(scope.package.images.length).toBe(2);
        expect(scope.package.images[0]).toBe('test2');
    });
});
