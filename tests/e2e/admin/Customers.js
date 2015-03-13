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

    it('should have 6 columns', function() {
        gridTestUtils.expectHeaderColumnCount('customers-table', 6);
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 0, 'ID');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 1, 'Name');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 2, 'Email');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 3, 'Payment on Account');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 4, 'Customer Since');
        gridTestUtils.expectHeaderCellValueMatch('customers-table', 5, 'Action');
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('customers-table', 2);
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
