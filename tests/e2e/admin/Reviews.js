describe('Admin - orders page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/reviews');
            isFirst = false;
            gridObject = new GridObjectTest('reviews-table');
        }
    });

    it('should have the title "Orders"', function() {
        expect(element(by.css('h1')).getText()).toBe('Reviews');
    });

    it('should have 7 rows', function() {
        gridObject.expectRowCount(7);
    });

    it('should have the correctly named columns', function() {
        gridObject.expectHeaderColumns([
            'Order',
            'Review Date',
            'Overall Rating',
            'Is Public?',
            'View',
        ]);
    });

    it('should find 2 orders when filtered by an overall rating of 4', function() {
        gridObject.enterFilterInColumn(2, '4');
        gridObject.expectRowCount(2);
        gridObject.expectCellValueMatch(0, 2, '4');
    });

    it('should find 7 orders when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(2);
        gridObject.expectRowCount(7);
    });
});
