describe('Admin - changing a user\'s password', function() {
    var isFirst = true;
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var gridObject;
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

    it('should have a button linking to the "change password" page', function() {
        element(by.cssContainingText('button', 'Change password')).click();
        expect(browser.getCurrentUrl()).toMatch(/\/password$/);
    });

    it('should be able to change the user\'s password', function() {
        var button = element(by.css('button.cp-change-password'));
        expect(button.getText()).toBe('DO IT');
        button.click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Done.');
        notificationModal.dismiss();
    });
});
