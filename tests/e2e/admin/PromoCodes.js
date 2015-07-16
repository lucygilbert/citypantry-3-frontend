describe('Admin - promo codes page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/promo-codes');
            isFirst = false;
            gridObject = new GridObjectTest('promo-codes-table');
        }
    });

    it('should have the title "Promo codes"', function() {
        expect(element(by.css('h1')).getText()).toBe('Promo codes');
    });

    it('should have 8 columns', function() {
        gridObject.expectHeaderColumns([
            'Code',
            'Valid from',
            'Discount',
            'Discount type',
            'Use type',
            'Use count',
            'Actions',
        ]);
    });

    it('should have 12 rows', function() {
        gridObject.expectRowCount(12);
    });

    it('should find 1 promo code when filtered by "TEST2"', function() {
        gridObject.enterFilterInColumn(0, 'TEST2');
        gridObject.expectRowCount(1);
        gridObject.cancelFilterInColumn(0);
    });
});
