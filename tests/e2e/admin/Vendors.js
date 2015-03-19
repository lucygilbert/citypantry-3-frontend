describe('Admin - vendors page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/vendors');
            isFirst = false;
        }
    });

    it('should have the title "Vendors"', function() {
        expect(element(by.css('h1')).getText()).toBe('Vendors');
    });

    it('should have 6 columns', function() {
        gridTestUtils.expectHeaderColumnCount('vendors-table', 6);
    });

    it('should have 6 rows', function() {
        gridTestUtils.expectRowCount('vendors-table', 6);
    });

    it('should have the column name "ID"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 0, 'ID');
    });

    it('should have the column name "Name"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 1, 'Name');
    });

    it('should have the column name "Email"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 2, 'Email');
    });

    it('should have the column name "Business Type"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 3, 'Business Type');
    });

    it('should have the column name "Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 4, 'Status');
    });

    it('should have the column name "Action"', function() {
        gridTestUtils.expectHeaderCellValueMatch('vendors-table', 5, 'Action');
    });

    it('should find 3 vendors when filtered by "Chef"', function() {
        gridTestUtils.enterFilterInColumn('vendors-table', 3, 'Chef');
        gridTestUtils.expectRowCount('vendors-table', 3);
        gridTestUtils.expectCellValueMatch('vendors-table', 0, 3, 'Chef');
    });

    it('should find 6 vendors when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('vendors-table', 3);
        gridTestUtils.expectRowCount('vendors-table', 6);
    });
});
