describe('Admin - orders page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/order');
            isFirst = false;
        }
    });

    it('should have the title "Orders"', function() {
        expect(element(by.css('h1')).getText()).toBe('Orders');
    });

    it('should have 9 columns', function() {
        gridTestUtils.expectHeaderColumnCount('ordersTable', 9);
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('ordersTable', 2);
    });

    it('should have the column name "Order No"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 0, 'Order No');
    });

    it('should have the column name "Order Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 1, 'Order Date');
    });

    it('should have the column name "Delivery Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 2, 'Delivery Date');
    });

    it('should have the column name "Customer"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 3, 'Customer');
    });

    it('should have the column name "Vendor"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 4, 'Vendor');
    });

    it('should have the column name "Package"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 5, 'Package');
    });

    it('should have the column name "People"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 6, 'People');
    });

    it('should have the column name "Amount"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 7, 'Amount');
    });

    it('should have the column name "Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('ordersTable', 8, 'Status');
    });

    it('should filter rows by package "Carrots"', function() {
        gridTestUtils.enterFilterInColumn('ordersTable', 5, 'Car');
        gridTestUtils.expectRowCount('ordersTable', 1);
        gridTestUtils.expectCellValueMatch('ordersTable', 0, 5, 'Carrots');
    });

    it('should cancel the filter by package "Carrots"', function() {
        gridTestUtils.cancelFilterInColumn('ordersTable', 5);
        gridTestUtils.expectRowCount('ordersTable', 2);
    });
});
