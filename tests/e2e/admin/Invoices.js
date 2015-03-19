var gridTestUtils = require('../lib/gridTestUtils.spec.js');
var notificationModal = require('../NotificationModal.js');

describe('Admin - invoices page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/invoices');
            isFirst = false;
        }
    });

    it('should load the "invoices" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Invoices');
    });

    it('should have 8 columns', function() {
        gridTestUtils.expectHeaderColumnCount('invoices-table', 8);
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 0, 'Invoice No');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 1, 'Invoice Date');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 2, 'Order No');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 3, 'Order Date');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 4, 'Customer');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 5, 'Invoice Status');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 6, 'Amount');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 7, 'View');
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('invoices-table', 2);
    });

    it('should find 1 invoice when filtered by status', function() {
        gridTestUtils.enterFilterInColumn('invoices-table', 5, 'Awaiting');
        gridTestUtils.expectRowCount('invoices-table', 1);
        gridTestUtils.expectCellValueMatch('invoices-table', 0, 4, 'Customer, Aperture Science');
    });

    it('should find 2 invoices when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('invoices-table', 5);
        gridTestUtils.expectRowCount('invoices-table', 2);
    });
});
