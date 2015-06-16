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

    it('should have 9 columns', function() {
        gridObject.expectHeaderColumns([
            'Invoice No',
            'Invoice Date',
            'Order No',
            'Order Date',
            'Paid on Account',
            'Customer',
            'Invoice Status',
            'Amount',
            'View',
        ]);
    });

    it('should have 5 rows', function() {
        gridObject.expectRowCount(5);
    });

    it('should find 1 invoice when filtered by status', function() {
        gridObject.enterFilterInColumn(6, 'Awaiting');
        gridObject.expectRowCount(1);
        gridObject.expectCellValueMatch(0, 5, 'Customer, Aperture Science');
    });

    it('should find 5 invoices when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(6);
        gridObject.expectRowCount(5);
    });

    it('should be able to mark an invoice as paid', function() {
        gridObject.enterFilterInColumn(6, 'Awaiting payment');

        var markAsPaidLink = element.all(by.css('#invoices-table a.invoice-status')).first();
        markAsPaidLink.click();

        gridObject.expectRowCount(0);

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.dismiss();
    });
});
