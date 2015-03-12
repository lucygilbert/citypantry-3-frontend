describe('Admin - orders page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/orders');
            isFirst = false;
        }
    });

    it('should have the title "Orders"', function() {
        expect(element(by.css('h1')).getText()).toBe('Orders');
    });

    it('should have 10 columns', function() {
        gridTestUtils.expectHeaderColumnCount('orders-table', 10);
    });

    it('should have 4 rows', function() {
        gridTestUtils.expectRowCount('orders-table', 4);
    });

    it('should have the column name "Order No"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 0, 'Order No');
    });

    it('should have the column name "Order Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 1, 'Order Date');
    });

    it('should have the column name "Delivery Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 2, 'Delivery Date');
    });

    it('should have the column name "Customer"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 3, 'Customer');
    });

    it('should have the column name "Vendor"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 4, 'Vendor');
    });

    it('should have the column name "Package"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 5, 'Package');
    });

    it('should have the column name "Cost"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 6, 'Cost');
    });

    it('should have the column name "Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 7, 'Order Status');
    });

    it('should have the column name "Delivery Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 8, 'Delivery Status');
    });

    it('should have the column name "View"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 9, 'View');
    });

    it('should find 1 order when filtered by "Carrots"', function() {
        gridTestUtils.enterFilterInColumn('orders-table', 5, 'Car');
        gridTestUtils.expectRowCount('orders-table', 1);
        gridTestUtils.expectCellValueMatch('orders-table', 0, 5, 'Carrots');
    });

    it('should find 4 orders when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('orders-table', 5);
        gridTestUtils.expectRowCount('orders-table', 4);
    });

    it('should find 2 orders when the "show orders delivered today" button is clicked', function() {
        // If this fails saying 3 rows were found, are you running just this test and not the Order.js
        // file which edits one order's delivery date? When all tests are run, there should only be
        // 3 order found.
        element(by.css('main .show-orders-delivered-today')).click();
        gridTestUtils.expectRowCount('orders-table', 2);
    });
});
