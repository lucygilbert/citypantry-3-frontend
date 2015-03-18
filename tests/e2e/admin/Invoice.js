var gridTestUtils = require('../lib/gridTestUtils.spec.js');

describe('Admin - invoice page', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/invoices');
            gridTestUtils.enterFilterInColumn('invoices-table', 5, 'Awaiting');
            element.all(by.css('#invoices-table a[href^="/admin/invoice/"]')).first().click();
            isFirst = false;
        }
    });

    it('should load the "invoice" page', function() {
        expect(browser.getCurrentUrl()).toMatch(/\/admin\/invoice\/[\da-f]{24}$/);
        expect(element(by.css('h1')).getText()).toMatch(/^Invoice CP\-\d+\-\d{4}$/);
    });

    it('should load the invoice details', function() {
        var invoice = element(by.css('.invoice')).getText();
        expect(invoice).toMatch(/Invoice No.: CP\-\d+\-\d{4}/);
        expect(invoice).toMatch(/Invoice Date and Tax Point: \d{2}\/\d{2}\/\d{4}/);
        expect(invoice).toContain('Package: Paella');
        expect(invoice).toContain('25 Lena Gardens');
        expect(invoice).toMatch(/Food\/Drink £(\d*\.\d{2}|\d+) 15/); // Head count = 15.
        expect(invoice).toContain('Subtotal £0.00');
        expect(invoice).toContain('VAT £0.00');
        expect(invoice).toContain('Grand Total £150.00');
    });
});
