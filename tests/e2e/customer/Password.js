describe('Password page', function() {
    var first = true;
    var currentPassword, newPassword, confirmPassword, saveBtn;
    var notificationModal = require('../NotificationModal.js');

    beforeEach(function() {
        if (first) {
            first = false;
            loginAsUser('customer@bunnies.test');
            browser.get('/customer/change-password');
        }

        currentPassword = element(by.id('current'));
        newPassword = element(by.id('new'));
        confirmPassword = element(by.id('confirm'));
        saveBtn = element(by.css('main input.btn'));
    });

    it('should show the form', function() {
        expect(element.all(by.css('main input[type="password"]')).count()).toBe(3);
    });

    it('should update the password and reset the fields', function () {
        currentPassword.sendKeys('password');
        newPassword.sendKeys('bunny');
        confirmPassword.sendKeys('bunny');
        saveBtn.click();

        notificationModal.expectIsOpen();
        notificationModal.expectSuccessHeader();
        notificationModal.expectMessage('Your password has been updated.');
        notificationModal.dismiss();

        expect(currentPassword.getAttribute('value')).toBe('');
        expect(newPassword.getAttribute('value')).toBe('');
        expect(confirmPassword.getAttribute('value')).toBe('');

        // Revert changes so that other tests will pass
        currentPassword.sendKeys('bunny');
        newPassword.sendKeys('password');
        confirmPassword.sendKeys('password');
        saveBtn.click();
        notificationModal.dismiss();
    });

    it('should fail if the current password is wrong or new password is not given and reset fields', function () {
        currentPassword.sendKeys('wrong');
        newPassword.sendKeys('bunny');
        confirmPassword.sendKeys('bunny');
        saveBtn.click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.dismiss();

        expect(currentPassword.getAttribute('value')).toBe('');
        expect(newPassword.getAttribute('value')).toBe('');
        expect(confirmPassword.getAttribute('value')).toBe('');
    });

    it('should fail if the two passwords don\'t match and reset fields', function () {
        currentPassword.sendKeys('password');
        newPassword.sendKeys('bunny');
        confirmPassword.sendKeys('bunnies');
        saveBtn.click();

        notificationModal.expectIsOpen();
        notificationModal.expectErrorHeader();
        notificationModal.expectMessage('The two passwords you entered do not match.');
        notificationModal.dismiss();

        expect(currentPassword.getAttribute('value')).toBe('');
        expect(newPassword.getAttribute('value')).toBe('');
        expect(confirmPassword.getAttribute('value')).toBe('');
    });
});
