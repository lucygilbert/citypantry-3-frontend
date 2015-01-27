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

    it('should have 8 columns', function() {
        gridTestUtils.expectHeaderColumnCount('order.gridOptions', 8);
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('order.gridOptions', 2);
    });

    it('should have the column name "Order No"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 0, 'Order No');
    });

    it('should have the column name "Order Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 1, 'Order Date');
    });

    it('should have the column name "Delivery Date"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 2, 'Delivery Date');
    });

    it('should have the column name "Customer"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 3, 'Customer');
    });

    it('should have the column name "Vendor"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 4, 'Vendor');
    });

    it('should have the column name "Package"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 5, 'Package');
    });

    it('should have the column name "Amount"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 6, 'Amount');
    });

    it('should have the column name "Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('order.gridOptions', 7, 'Status');
    });

    it('should find 1 package when filtered by "Carrots"', function() {
        gridTestUtils.enterFilterInColumn('order.gridOptions', 5, 'Car');
        gridTestUtils.expectRowCount('order.gridOptions', 1);
        gridTestUtils.expectCellValueMatch('order.gridOptions', 0, 5, 'Carrots');
    });

    it('should find 2 packages when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('order.gridOptions', 5);
        gridTestUtils.expectRowCount('order.gridOptions', 2);
    });
});
