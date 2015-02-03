describe('Admin - courier orders page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders/courier');
            isFirst = false;
        }
    });

    it('should have the title "Courier Orders"', function() {
        expect(element(by.css('h1')).getText()).toBe('Courier Orders');
    });

    it('should have 1 row', function() {
        gridTestUtils.expectRowCount('courier-orders-table', 1);
    });

    it('should have 9 columns', function() {
        gridTestUtils.expectHeaderColumnCount('courier-orders-table', 9);
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 0, 'Order ID');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 1, 'Delivery Date');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 2, 'Pickup Time');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 3, 'Food Left Kitchen');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 4, 'Collected');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 5, 'Delivered');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 6, 'Courier Ref');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 7, 'Status');
        gridTestUtils.expectHeaderCellValueMatch('courier-orders-table', 8, 'Action');
    });
});
