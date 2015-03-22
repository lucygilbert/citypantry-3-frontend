describe('Admin - mass edit vendors page', function() {
    var isFirst = true;
    var vendors;
    var vendor;
    var nameInput;
    var saveButton;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/vendors/edit');
            isFirst = false;
        }

        vendors = element.all(by.repeater('vendor in vendors'));
        vendor = vendors.get(0);
        nameInput = vendor.element(by.model('vendor.name'));
        saveButton = vendor.element(by.css('button'));
    });

    it('should list 6 vendors', function() {
        expect(vendors.count()).toBe(6);
    });

    it('should not show the save button when the vendor has not been edited', function() {
        expect(saveButton.isDisplayed()).toBe(false);
    });

    it('should show the current details of each vendor', function() {
        expect(nameInput.getAttribute('value')).toBe('Flame Mangal');
    });

    it('should show the save button once the vendor has been edited', function() {
        nameInput.clear().sendKeys('New name');
        expect(saveButton.isDisplayed()).toBe(true);
    });

    it('should be able to save', function() {
        saveButton.click();
    });

    it('should not show the save button after the vendor has been saved', function() {
        expect(saveButton.isDisplayed()).toBe(false);
    });

    it('should revert the changed name so other tests are not affected by this one', function() {
        nameInput.clear().sendKeys('Flame Mangal');
        saveButton.click();
    });
});
