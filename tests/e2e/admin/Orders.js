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

    it('should have 9 columns', function() {
        gridTestUtils.expectHeaderColumnCount('orders-table', 9);
    });

    it('should have 3 rows', function() {
        gridTestUtils.expectRowCount('orders-table', 3);
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
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 7, 'Status');
    });

    it('should have the column name "View"', function() {
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 8, 'View');
    });

    it('should find 1 order when filtered by "Carrots"', function() {
        gridTestUtils.enterFilterInColumn('orders-table', 5, 'Car');
        gridTestUtils.expectRowCount('orders-table', 1);
        gridTestUtils.expectCellValueMatch('orders-table', 0, 5, 'Carrots');
    });

    it('should find 3 orders when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('orders-table', 5);
        gridTestUtils.expectRowCount('orders-table', 3);
    });

    it('should find 2 orders when the "show orders delivered today" button is clicked', function() {
        element(by.css('main .show-orders-delivered-today')).click();
        gridTestUtils.expectRowCount('orders-table', 2);
    });
});
