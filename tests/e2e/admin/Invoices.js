var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
var notificationModal = require('../NotificationModal.js');

describe('Admin - invoices page', function() {
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/invoices');
            isFirst = false;
            gridObject = new GridObjectTest('invoices-table');
        }
    });

    it('should load the "invoices" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Invoices');
    });

    it('should have 10 columns', function() {
        gridObject.expectHeaderColumns([
            'Invoice No',
            'Invoice Date',
            'Order No',
            'Order Date',
            'Paid on Account',
            'Customer',
            'Invoice Status',
            'Amount',
            'Overdue?',
            'View',
        ]);
    });

    it('should have 6 rows', function() {
        gridObject.expectRowCount(6);
    });

    it('should find 2 invoice when filtered by awaiting payment status', function() {
        gridObject.enterFilterInColumn(6, 'Awaiting');
        gridObject.expectRowCount(2);
    });

    it('should find 6 invoices when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(6);
        gridObject.expectRowCount(6);
    });

    it('should find 1 invoices when filtered by overdue', function() {
        gridObject.enterFilterInColumn(8, 'Yes');
        gridObject.expectRowCount(1);
        gridObject.cancelFilterInColumn(8);
    });

    it('should be able to mark an invoice as paid', function() {
        gridObject.enterFilterInColumn(6, 'Awaiting payment');

        var markAsPaidLink = element.all(by.css('#invoices-table a.invoice-status')).first();
        markAsPaidLink.click();

        gridObject.expectRowCount(1);

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.dismiss();
    });
});
