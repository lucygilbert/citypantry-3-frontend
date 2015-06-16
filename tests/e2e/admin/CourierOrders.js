describe('Admin - courier orders page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders/courier');
            isFirst = false;
            gridObject = new GridObjectTest('courier-orders-table');
        }
    });

    it('should have the title "Courier Orders"', function() {
        expect(element(by.css('h1')).getText()).toBe('Courier Orders');
    });

    it('should have 1 row', function() {
        gridObject.expectRowCount(1);
    });

    it('should have 10 columns', function() {
        gridObject.expectHeaderColumns([
            'Order No.',
            'Delivery Date',
            'Pickup Time',
            'Food Left Kitchen',
            'Collected',
            'Delivered',
            'Courier Ref No',
            'Order Status',
            'Delivery Status',
            'Action',
        ]);
    });
});
