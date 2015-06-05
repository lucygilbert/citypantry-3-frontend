describe('cpReviewCard directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var OrdersFactory;
    var ReviewFactory;

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope, _OrdersFactory_, _ReviewFactory_) {
        scope = $rootScope.$new();
        OrdersFactory = _OrdersFactory_;
        ReviewFactory = _ReviewFactory_;

        makeCtrl = function () {
            $controller('cpReviewCardController', {
                $scope: scope,
            });
        };

        spyOn(OrdersFactory, 'getOrder').and.returnValue(newPromise());
        spyOn(ReviewFactory, 'setReviewAsPublic').and.returnValue(newPromise());

        scope.review = {};
        scope.review.orderId = '123';
    }));

    it('should load the order', function() {
        makeCtrl();

        expect(OrdersFactory.getOrder).toHaveBeenCalled();
        var getOrderCallArgs = OrdersFactory.getOrder.calls.mostRecent().args;
        expect(getOrderCallArgs[0]).toBe('123');
    });

    it('should toggle a review being public or private when the link is clicked', function() {
        scope.review.isPublic = true;
        scope.review.id = 'abc';

        makeCtrl();
        scope.toggleIsPublic();

        expect(ReviewFactory.setReviewAsPublic).toHaveBeenCalled();
        var setReviewAsPublicCallArgs = ReviewFactory.setReviewAsPublic.calls.mostRecent().args;
        expect(setReviewAsPublicCallArgs[0]).toBe(false);
        expect(setReviewAsPublicCallArgs[1]).toBe('abc');
    });
});
