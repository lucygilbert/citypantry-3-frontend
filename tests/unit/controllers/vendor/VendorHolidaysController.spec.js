describe('VendorHolidaysController', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var NotificationService;
    var VendorsFactory;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, _NotificationService_, _VendorsFactory_) {
        scope = $rootScope.$new();
        NotificationService = _NotificationService_;
        VendorsFactory = _VendorsFactory_;

        makeCtrl = function () {
            $controller('VendorHolidaysController', {
                $scope: scope,
            });
        };
    }));

    describe('create', function() {
        beforeEach(function() {
            spyOn(NotificationService, 'notifyError');
            spyOn(VendorsFactory, 'createHoliday').and.returnValue(newPromise());
        });

        it('should should an error message if no start date is entered', function() {
            scope.end = new Date('2014-05-05T12:00:00+0000');

            makeCtrl();
            scope.create();

            expect(NotificationService.notifyError).toHaveBeenCalled();
            expect(VendorsFactory.createHoliday).not.toHaveBeenCalled();
        });

        it('should should an error message if no end date is entered', function() {
            scope.start = new Date('2014-05-05T12:00:00+0000');

            makeCtrl();
            scope.create();

            expect(NotificationService.notifyError).toHaveBeenCalled();
            expect(VendorsFactory.createHoliday).not.toHaveBeenCalled();
        });

        it('should call VendorsFactory.createHoliday with strings formatted as YYYY-MM-DD', function() {
            scope.start = new Date('2014-05-05T12:00:00Z');
            scope.end = new Date('2014-05-23T00:00:00Z');

            makeCtrl();
            scope.create();

            expect(VendorsFactory.createHoliday.calls.mostRecent().args)
                .toEqual(['2014-05-05', '2014-05-23']);
            expect(NotificationService.notifyError).not.toHaveBeenCalled();
        });
    });
});
