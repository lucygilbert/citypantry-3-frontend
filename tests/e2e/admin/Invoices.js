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
        gridTestUtils.expectHeaderColumnCount('invoices-table', 9);
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 0, 'Invoice No');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 1, 'Invoice Date');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 2, 'Order No');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 3, 'Order Date');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 4, 'Paid on Account');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 5, 'Customer');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 6, 'Invoice Status');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 7, 'Amount');
        gridTestUtils.expectHeaderCellValueMatch('invoices-table', 8, 'View');
    });

    it('should have 5 rows', function() {
        gridTestUtils.expectRowCount('invoices-table', 5);
    });

    it('should find 1 invoice when filtered by status', function() {
        gridTestUtils.enterFilterInColumn('invoices-table', 6, 'Awaiting');
        gridTestUtils.expectRowCount('invoices-table', 1);
        gridTestUtils.expectCellValueMatch('invoices-table', 0, 5, 'Customer, Aperture Science');
    });

    it('should find 5 invoices when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('invoices-table', 6);
        gridTestUtils.expectRowCount('invoices-table', 5);
    });

    it('should be able to mark an invoice as paid', function() {
        gridTestUtils.enterFilterInColumn('invoices-table', 6, 'Awaiting payment');

        var markAsPaidLink = element.all(by.css('#invoices-table a.invoice-status')).first();
        markAsPaidLink.click();

        gridTestUtils.expectRowCount('invoices-table', 0);

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.dismiss();
    });
});
