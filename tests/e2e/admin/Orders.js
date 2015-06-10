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
        // `expectHeaderCellValueMatch` takes a regex for the expected value, so we need to
        // escape the brackets and dot.
        gridTestUtils.expectHeaderCellValueMatch('orders-table', 6, /Cost \(inc\. VAT\)/);
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

    it('should find some orders when the "show orders delivered today" button is clicked', function() {
        element(by.css('main .show-orders-delivered-today')).click();

        // Then number of rows found depends on a few things:
        // - time the test is run (because the time in fixtures varies, and the time and timezone when
        // running the tests varies).
        // - if this test is being ran in isolation.
        // For that reason, we don't want to be too strict about the expected row count. However,
        // there should be at least 1 order regardless of those factors.
        var rows = element(by.id('orders-table')).all(by.repeater('(rowRenderIndex, row) in rowContainer.renderedRows track by $index'));
        expect(rows.count()).toBeGreaterThan(0);
    });
});
