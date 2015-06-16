describe('Admin - packages page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages');
            isFirst = false;
            gridObject = new GridObjectTest('packages-table');
        }
    });

    it('should have the title "Packages"', function() {
        expect(element(by.css('h1')).getText()).toBe('Packages');
    });

    it('should have 9 columns', function() {
        gridObject.expectHeaderColumnCount(9);
    });

    it('should have 10 rows', function() {
        gridObject.expectRowCount(10);
    });

    it('should have the column name "ID"', function() {
        gridObject.expectHeaderCellValueMatch(0, 'ID');
    });

    it('should have the column name "Name"', function() {
        gridObject.expectHeaderCellValueMatch(1, 'Name');
    });

    it('should have the column name "Food Type"', function() {
        gridObject.expectHeaderCellValueMatch(2, 'Food Type');
    });

    it('should have the column name "Vendor"', function() {
        gridObject.expectHeaderCellValueMatch(3, 'Vendor');
    });

    it('should have the column name "Cost"', function() {
        // `expectHeaderCellValueMatch` takes a regex for the expected value, so we need to
        // escape the brackets and dot.
        gridObject.expectHeaderCellValueMatch(4, /Cost \(inc\. VAT\)/);
    });

    it('should have the column name "Min People"', function() {
        gridObject.expectHeaderCellValueMatch(5, 'Min People');
    });

    it('should have the column name "Max People"', function() {
        gridObject.expectHeaderCellValueMatch(6, 'Max People');
    });

    it('should have the column name "Status"', function() {
        gridObject.expectHeaderCellValueMatch(7, 'Status');
    });

    it('should have the column name "Action"', function() {
        gridObject.expectHeaderCellValueMatch(8, 'Action');
    });

    it('should find 2 packages when filtered by "Hong Tin"', function() {
        gridObject.enterFilterInColumn(3, 'Hong');
        gridObject.expectRowCount(2);
        gridObject.expectCellValueMatch(0, 3, 'Hong Tin');
    });

    it('should find 10 packages when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(3);
        gridObject.expectRowCount(10);
    });

    it('should be able to approve unapproved packages', function() {
        gridObject.enterFilterInColumn(7, 'Awaiting approval');
        gridObject.expectRowCount(1);
        element(by.css('#packages-table a.approve-package')).click();
        gridObject.expectRowCount(0);
    });
});
