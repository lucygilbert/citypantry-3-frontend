describe('CheckoutPaymentController', function() {
    'use strict';

    var scope;
    var $rootScope;
    var makeCtrl;
    var OrdersFactory;
    var PackagesFactory;
    var UsersFactory;
    var CheckoutService;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, _$rootScope_, _CheckoutService_, _OrdersFactory_,
        _LoadingService_, _PackagesFactory_, _UsersFactory_, _SecurityService_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        OrdersFactory = _OrdersFactory_;
        PackagesFactory = _PackagesFactory_;
        UsersFactory = _UsersFactory_;
        CheckoutService = _CheckoutService_;

        mockLoggedIn(_SecurityService_);

        makeCtrl = function () {
            $controller('CheckoutPaymentController', {
                $scope: scope,
            });
        };
    }));

    describe('$scope.finish()', function() {
        beforeEach(function() {
            spyOn(OrdersFactory, 'createOrder').and.returnValue(newPromise());
            spyOn(CheckoutService, 'getDeliveryDate').and.returnValue(new Date());
            spyOn(PackagesFactory, 'getPackage').and.returnValue(newPromise());
            spyOn(UsersFactory, 'getPaymentCards').and.returnValue(newPromise());
            spyOn(UsersFactory, 'getLoggedInUser').and.returnValue(newPromise());

            makeCtrl();

            scope.checkoutForm = newValidForm();

            // Set the order as pay on account so we don't need to mock the payment card API call.
            scope.order.isPayOnAccount = true;
        });

        it('should create an order with the correct checkout questionnaire answers', function() {
            scope.checkoutQuestionnaireAnswers = {
                'abc111111111111111111111': 0,
                'abc222222222222222222222': 3,
            };

            scope.finish();

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args;
            var answers = args[0].checkoutQuestionnaireAnswers;
            expect(answers.length).toBe(2);
            expect(answers[0].questionId).toBe('abc111111111111111111111');
            expect(answers[0].answerValue).toBe(0);
        });

        it('should create an order when there are no checkout questionnaire answers', function() {
            scope.checkoutQuestionnaireAnswers = undefined;

            scope.finish();

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args;
            var answers = args[0].checkoutQuestionnaireAnswers;
            expect(answers instanceof Array).toBe(true);
            expect(answers.length).toBe(0);
        });
    });
});
