describe('Admin - customers page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            isFirst = false;
        }
    });

    it('should have the title "Customers"', function() {
        expect(element(by.css('h1')).getText()).toBe('Customers');
    });

    it('should have 5 columns', function() {
        gridTestUtils.expectHeaderColumnCount('customers-table', 5);
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('customers-table', 2);
    });

    it('should have the column name "ID"', function() {
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 0, 'ID');
    });

    it('should have the column name "Name"', function() {
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 1, 'Name');
    });

    it('should have the column name "Email"', function() {
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 2, 'Email');
    });

    it('should have the column name "Customer Since"', function() {
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 3, 'Customer Since');
    });

    it('should have the column name "Action"', function() {
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 4, 'Action');
    });

    it('should find 1 customer when filtered by "alice@bunnies.test"',
            function() {
        gridTestUtils.enterFilterInColumn('customers-table', 2, 'alice@');
        gridTestUtils.expectRowCount('customers-table', 1);
        gridTestUtils.expectCellValueMatch('customers-table', 0, 2,
                'alice@bunnies.test');
    });

    it('should find 2 customers when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('customers-table', 2);
        gridTestUtils.expectRowCount('customers-table', 2);
    });
});
