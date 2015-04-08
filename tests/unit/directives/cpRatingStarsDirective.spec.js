describe('cpRatingStars directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        makeCtrl = function () {
            $controller('cpRatingStarsController', {
                $scope: scope,
            });
        };
    }));

    describe('getStarClass', function() {
        it('returns the correct classes for an integer value', function() {
            scope.value = 3;

            makeCtrl();

            expect(scope.getStarClass(2)).toBe('icon-star');
            expect(scope.getStarClass(3)).toBe('icon-star');
            expect(scope.getStarClass(4)).toBe('icon-star-o');
        });

        it('returns the correct classes for an integer-and-a-half value', function() {
            scope.value = 3.5;

            makeCtrl();

            expect(scope.getStarClass(3)).toBe('icon-star');
            expect(scope.getStarClass(4)).toBe('icon-star-half-o');
            expect(scope.getStarClass(5)).toBe('icon-star-o');
        });
    });
});
