describe('Admin - customers page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var notificationModal = require('../NotificationModal.js');
    var isFirst = true;
    var gridObject;
    var NUMBER_OF_FIXTURE_CUSTOMERS = 4;
    var EMAIL_COLUMN_IN_CUSTOMERS_PAGE = 3;

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

    it('should have ' + NUMBER_OF_FIXTURE_CUSTOMERS + ' rows', function() {
        gridObject.expectRowCount(NUMBER_OF_FIXTURE_CUSTOMERS);
    });

    it('should find 1 customer when filtered by "alice@bunnies.test"',
            function() {
        gridObject.enterFilterInColumn(EMAIL_COLUMN_IN_CUSTOMERS_PAGE, 'alice@');
        gridObject.expectRowCount(1);
        gridObject.expectCellValueMatch(0, EMAIL_COLUMN_IN_CUSTOMERS_PAGE, 'alice@bunnies.test');
    });

    it('should find ' + NUMBER_OF_FIXTURE_CUSTOMERS + ' customers when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(EMAIL_COLUMN_IN_CUSTOMERS_PAGE);
        gridObject.expectRowCount(NUMBER_OF_FIXTURE_CUSTOMERS);
    });
});
