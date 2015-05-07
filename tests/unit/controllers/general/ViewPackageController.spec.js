describe('ViewPackageController', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var PackagesFactory;
    var CheckoutService;
    var LoadingService;
    var $routeParams;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, $rootScope, _$routeParams_, _CheckoutService_,
            _PackagesFactory_, _LoadingService_) {
        scope = $rootScope.$new();
        CheckoutService = _CheckoutService_;
        PackagesFactory = _PackagesFactory_;
        LoadingService = _LoadingService_;
        $routeParams = _$routeParams_;

        makeCtrl = function () {
            $controller('ViewPackageController', {
                $scope: scope,
            });
        };
    }));

    describe('should convert a date/time to an ISO 8601 string, a date string, and a time string', function() {
        var checkPromise;

        beforeEach(function() {
            checkPromise = newPromise();
            spyOn(PackagesFactory, 'checkIfPackageCanBeDelivered').and.returnValue(checkPromise);
            spyOn(CheckoutService, 'setDeliveryDate');
            spyOn(LoadingService, 'show');
            spyOn(LoadingService, 'hide');
            $routeParams.humanIdAndSlug = '123';
            scope.package = {
                id: 'abcdef',
            };
            scope.packageForm = newValidForm();
            makeCtrl();
        });

        it('with a date/time outside British Summer Time', function() {
            scope.order.date = new Date(Date.UTC(2005, 1, 2));
            scope.order.time = '0300';

            scope.order();

            var args = PackagesFactory.checkIfPackageCanBeDelivered.calls.mostRecent().args;
            expect(args[1]).toEqual('2005-02-02');
            expect(args[2]).toEqual('0300');
            expect(scope.iso8601DateString).toBe('2005-02-02T03:00:00+00:00');

            checkPromise.resolveSuccess({isAvailable: true});

            var persistArgs = CheckoutService.setDeliveryDate.calls.mostRecent().args;
            expect(persistArgs[0].getTime()).toEqual(Date.UTC(2005, 1, 2, 3, 0, 0));
        });

        it('with a date/time inside British Summer Time', function() {
            scope.order.date = new Date(Date.UTC(2005, 2, 27));
            scope.order.time = '0300';

            scope.order();

            var checkArgs = PackagesFactory.checkIfPackageCanBeDelivered.calls.mostRecent().args;
            expect(checkArgs[1]).toEqual('2005-03-27');
            expect(checkArgs[2]).toEqual('0300');
            expect(scope.iso8601DateString).toBe('2005-03-27T03:00:00+01:00');

            checkPromise.resolveSuccess({isAvailable: true});

            var persistArgs = CheckoutService.setDeliveryDate.calls.mostRecent().args;
            expect(persistArgs[0].getTime()).toEqual(Date.UTC(2005, 2, 27, 2, 0, 0));
        });
    });
});
