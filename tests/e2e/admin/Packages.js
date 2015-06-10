describe('Admin - packages page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            isFirst = false;
        }
    });

    it('should have the title "Packages"', function() {
        expect(element(by.css('h1')).getText()).toBe('Packages');
    });

    it('should have 9 columns', function() {
        gridTestUtils.expectHeaderColumnCount('packages-table', 9);
    });

    it('should have 10 rows', function() {
        gridTestUtils.expectRowCount('packages-table', 10);
    });

    it('should have the column name "ID"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 0, 'ID');
    });

    it('should have the column name "Name"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 1, 'Name');
    });

    it('should have the column name "Food Type"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 2, 'Food Type');
    });

    it('should have the column name "Vendor"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 3, 'Vendor');
    });

    it('should have the column name "Cost"', function() {
        // `expectHeaderCellValueMatch` takes a regex for the expected value, so we need to
        // escape the brackets and dot.
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 4, /Cost \(inc\. VAT\)/);
    });

    it('should have the column name "Min People"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 5, 'Min People');
    });

    it('should have the column name "Max People"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 6, 'Max People');
    });

    it('should have the column name "Status"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 7, 'Status');
    });

    it('should have the column name "Action"', function() {
        gridTestUtils.expectHeaderCellValueMatch('packages-table', 8, 'Action');
    });

    it('should find 2 packages when filtered by "Hong Tin"', function() {
        gridTestUtils.enterFilterInColumn('packages-table', 3, 'Hong');
        gridTestUtils.expectRowCount('packages-table', 2);
        gridTestUtils.expectCellValueMatch('packages-table', 0, 3, 'Hong Tin');
    });

    it('should find 10 packages when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('packages-table', 3);
        gridTestUtils.expectRowCount('packages-table', 10);
    });

    it('should be able to approve unapproved packages', function() {
        gridTestUtils.enterFilterInColumn('packages-table', 7, 'Awaiting approval');
        gridTestUtils.expectRowCount('packages-table', 1);
        element(by.css('#packages-table a.approve-package')).click();
        gridTestUtils.expectRowCount('packages-table', 0);
    });
});
