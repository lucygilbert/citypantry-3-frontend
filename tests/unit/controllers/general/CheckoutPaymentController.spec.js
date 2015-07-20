describe('CheckoutPaymentController', function() {
    'use strict';

    var scope;
    var $rootScope;
    var makeCtrl;
    var OrdersFactory;
    var PackagesFactory;
    var UsersFactory;
    var CheckoutService;
    var PromoCodeFactory;

    beforeEach(function() {
        module('cp');
    });

    beforeEach(inject(function($controller, _$rootScope_, _CheckoutService_, _OrdersFactory_,
        _LoadingService_, _PackagesFactory_, _UsersFactory_, _SecurityService_, _PromoCodeFactory_) {
        scope = _$rootScope_.$new();
        $rootScope = _$rootScope_;
        OrdersFactory = _OrdersFactory_;
        PackagesFactory = _PackagesFactory_;
        UsersFactory = _UsersFactory_;
        CheckoutService = _CheckoutService_;
        PromoCodeFactory = _PromoCodeFactory_;

        mockLoggedIn(_SecurityService_);

        makeCtrl = function () {
            $controller('CheckoutPaymentController', {
                $scope: scope,
            });
        };

        spyOn(PackagesFactory, 'getPackage').and.returnValue(newPromise());
        spyOn(UsersFactory, 'getPaymentCards').and.returnValue(newPromise());
        spyOn(UsersFactory, 'getLoggedInUser').and.returnValue(newPromise());
    }));

    describe('$scope.finish()', function() {
        beforeEach(function() {
            spyOn(OrdersFactory, 'createOrder').and.returnValue(newPromise());
            spyOn(CheckoutService, 'getDeliveryDate').and.returnValue(new Date());

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

        it('should create an order when an existing payment card is being used', function() {
            scope.order.isPayOnAccount = false;
            scope.order.paymentMethod = {
                id: 'existing_card_id',
            };

            scope.finish();

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args[0];
            expect(args.isExpectedToBeFree).toBe(false);
            expect(args.payOnCard).toBe('existing_card_id');
        });

        it('should create an order when a new payment card is being used', function() {
            scope.order.isPayOnAccount = false;
            scope.card = {
                number: '1234567812345678',
            };

            var addPaymentCardPromise = newPromise();
            spyOn(UsersFactory, 'addPaymentCard').and.returnValue(addPaymentCardPromise);

            scope.finish();

            expect(UsersFactory.addPaymentCard).toHaveBeenCalled();
            addPaymentCardPromise.resolveSuccess({card: {id: 'new_card_id'}});

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args[0];
            expect(args.isExpectedToBeFree).toBe(false);
            expect(args.payOnCard).toBe('new_card_id');
        });

        it('should create an order when paying on account', function() {
            scope.order.isPayOnAccount = true;

            scope.finish();

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args[0];
            expect(args.isExpectedToBeFree).toBe(false);
            expect(args.payOnAccount).toBe(true);
        });

        it('should create an order when payments details are not required', function() {
            scope.requirePaymentDetails = false;

            scope.finish();

            $rootScope.$digest();

            var args = OrdersFactory.createOrder.calls.mostRecent().args[0];
            expect(args.isExpectedToBeFree).toBe(true);
            expect(args.payOnCard).not.toBeDefined();
            expect(args.payOnAccount).not.toBeDefined();
        });
    });

    describe('calculating the total cost', function() {
        var getPromoCodeByCodePromise;

        beforeEach(function() {
            getPromoCodeByCodePromise = newPromise();
            spyOn(PromoCodeFactory, 'getPromoCodeByCode').and.returnValue(getPromoCodeByCodePromise);

            spyOn(CheckoutService, 'getTotalAmount').and.returnValue(200.54);

            makeCtrl();
        });

        it('should require payment details if no promo code is used', function() {
            scope.order.promoCodeCode = null;

            scope.submitPromoCode();

            expect(scope.order.promoCode).not.toBeDefined();
            expect(scope.order.totalAmount).toBe(200.54);
            expect(scope.order.promoCodeValue).not.toBeDefined();
            expect(scope.requirePaymentDetails).toBe(true);
        });

        it('should reduce the cost and require payment details if a non-100% promo code is used',
                function() {
            scope.order.promoCodeCode = '50%disCouNT';

            scope.submitPromoCode();
            getPromoCodeByCodePromise.resolveSuccess({
                promoCode: {code: '50%DISCOUNT', type: 'percentage', discount: 50},
                isValid: true
            });

            expect(scope.order.promoCode.code).toBe('50%DISCOUNT');
            expect(scope.order.totalAmount).toBe(100.27);
            expect(scope.order.promoCodeValue).toBe(100.27);
            expect(scope.requirePaymentDetails).toBe(true);
        });

        it('should reduce the cost to zero and not require payment details if a 100% discount is used',
                function() {
            scope.order.promoCodeCode = '100%disCouNT';

            scope.submitPromoCode();
            getPromoCodeByCodePromise.resolveSuccess({
                promoCode: {code: '100%DISCOUNT', type: 'percentage', discount: 100},
                isValid: true
            });

            expect(scope.order.promoCode.code).toBe('100%DISCOUNT');
            expect(scope.order.totalAmount).toBe(0);
            expect(scope.order.promoCodeValue).toBe(200.54);
            expect(scope.requirePaymentDetails).toBe(false);
        });

        it('should reduce the cost to zero and not require payment details if a fixed full discount is used',
                function() {
            scope.order.promoCodeCode = 'VERY_BIG_promo'
            scope.submitPromoCode();
            getPromoCodeByCodePromise.resolveSuccess({
                promoCode: {code: 'VERY_BIG_PROMO', type: 'fixed', discount: 12345},
                isValid: true
            });

            expect(scope.order.promoCode.code).toBe('VERY_BIG_PROMO');
            expect(scope.order.totalAmount).toBe(0);
            expect(scope.order.promoCodeValue).toBe(200.54);
            expect(scope.requirePaymentDetails).toBe(false);
        });

        it('should not reduce the cost if an expired discount is used', function() {
            scope.order.promoCodeCode = '100%expired_disCouNT';

            scope.submitPromoCode();
            getPromoCodeByCodePromise.resolveSuccess({
                promoCode: {code: '100%expired_disCouNT', type: 'percentage', discount: 100},
                isValid: false
            });

            expect(scope.order.promoCode).not.toBeDefined();
            expect(scope.order.totalAmount).toBe(200.54);
            expect(scope.order.promoCodeValue).not.toBeDefined();
            expect(scope.requirePaymentDetails).toBe(true);
        });
    });
});
