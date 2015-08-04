describe('Admin - "view and edit" user page', function() {
    var isFirst = true;
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var gridObject;
    var historyTable = require('../HistoryTable.js');
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/users');
            isFirst = false;
            gridObject = new GridObjectTest('users-table');
            gridObject.enterFilterInColumn(1, 'Jack');

            var viewAndEditLink = element(by.css('a.view-and-edit'));
            expect(viewAndEditLink.getText()).toBe('View and edit');
            viewAndEditLink.click();
        }
    });

    it('should have the the user\'s name and email in the title', function() {
        expect(element(by.css('h1')).getText())
            .toMatch(/^User \d+\: Jackie Chan, oke@bunnies\.test$/);
    });

    it('should allow the user\'s email to be edited', function() {
        element(by.model('user.email')).clear().sendKeys('new-oke@new-email.test');

        element(by.css('input[type="submit"]')).click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('The user has been edited.');
        notificationModal.dismiss();
    });

    it('should load the user\'s history', function() {
        historyTable.expectHasSomeEvents();
    });

    it('should describe the user\'s group as a vendor and show revelant actions', function() {
        expect(element(by.css('.wrapper')).getText()).toContain('Vendor user actions');

        var removeUserFromVendorButton = element(by.cssContainingText('button', 'Remove user from vendor'));
        expect(removeUserFromVendorButton.isPresent()).toBe(true);
    });
});
