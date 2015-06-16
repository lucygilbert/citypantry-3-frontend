describe('Admin - customers page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/customers');
            isFirst = false;
            gridObject = new GridObjectTest('customers-table');
        }
    });

    it('should have the title "Customers"', function() {
        expect(element(by.css('h1')).getText()).toBe('Customers');
    });

    it('should have 8 columns', function() {
        gridObject.expectHeaderColumns([
            'ID',
            'Name',
            'Company',
            'Email',
            'Pay on Account?',
            'Persona',
            'Customer Since',
            'Action',
        ]);
    });

    it('should have 3 rows', function() {
        gridObject.expectRowCount(3);
    });

    it('should find 1 customer when filtered by "alice@bunnies.test"',
            function() {
        gridObject.enterFilterInColumn(3, 'alice@');
        gridObject.expectRowCount(1);
        gridObject.expectCellValueMatch(0, 3, 'alice@bunnies.test');
    });

    it('should find 3 customers when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(3);
        gridObject.expectRowCount(3);
    });
});
