describe('Admin - vendors page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/vendors');
            isFirst = false;
            gridObject = new GridObjectTest('vendors-table');
        }
    });

    it('should have the title "Vendors"', function() {
        expect(element(by.css('h1')).getText()).toBe('Vendors');
    });

    it('should have 6 columns', function() {
        gridObject.expectHeaderColumns([
            'ID',
            'Name',
            'Email',
            'Business Type',
            'Status',
            'Action',
        ]);
    });

    it('should have 6 rows', function() {
        gridObject.expectRowCount(6);
    });

    it('should find 3 vendors when filtered by "Chef"', function() {
        gridObject.enterFilterInColumn(3, 'Chef');
        gridObject.expectRowCount(3);
        gridObject.expectCellValueMatch(0, 3, 'Chef');
    });

    it('should find 6 vendors when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(3);
        gridObject.expectRowCount(6);
    });
});
