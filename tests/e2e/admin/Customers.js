describe('Admin - customers page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');
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

    it('should have 8 columns', function() {
        gridTestUtils.expectHeaderColumnCount('customers-table', 7);
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 0, 'ID');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 1, 'Name');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 2, 'Company');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 3, 'Email');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 4, 'Pay on Account?');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 5, 'Persona');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 6, 'Customer Since');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 7, 'Action');
    });

    it('should have 3 rows', function() {
        gridTestUtils.expectRowCount('customers-table', 3);
    });

    it('should find 1 customer when filtered by "alice@bunnies.test"',
            function() {
        gridTestUtils.enterFilterInColumn('customers-table', 3, 'alice@');
        gridTestUtils.expectRowCount('customers-table', 1);
        gridTestUtils.expectCellValueMatch('customers-table', 0, 3, 'alice@bunnies.test');
    });

    it('should find 3 customers when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('customers-table', 3);
        gridTestUtils.expectRowCount('customers-table', 3);
    });
});
