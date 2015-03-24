describe('Admin - mass edit packages page', function() {
    var isFirst = true;
    var packages;
    var package;
    var nameInput;
    var saveButton;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/packages/edit');
            isFirst = false;
        }

        packages = element.all(by.repeater('package in packages'));
        package = packages.get(0);
        nameInput = package.element(by.model('package.name'));
        saveButton = package.element(by.css('button'));
    });

    it('should list 10 packages', function() {
        expect(packages.count()).toBe(10);
    });

    it('should load cuisine type options', function() {
        var cuisineTypes = element.all(by.model('package.cuisineTypeId')).get(0);

        expect(cuisineTypes.element(by.cssContainingText('option', 'British')).isPresent()).toBe(true);
        expect(cuisineTypes.element(by.cssContainingText('option', 'Mexican')).isPresent()).toBe(true);
    });

    it('should not show the save button when the package has not been edited', function() {
        expect(saveButton.isDisplayed()).toBe(false);
    });

    it('should show the current details of each package', function() {
        expect(nameInput.getAttribute('value')).toBe('Beef and mixed veg curry');
    });

    it('should show the save button once the package has been edited', function() {
        nameInput.clear().sendKeys('New name');
        expect(saveButton.isDisplayed()).toBe(true);
    });

    it('should be able to save', function() {
        saveButton.click();
    });

    it('should not show the save button after the package has been saved', function() {
        expect(saveButton.isDisplayed()).toBe(false);
    });

    it('should revert the changed name so other tests are not affected by this one', function() {
        nameInput.clear().sendKeys('Beef and mixed veg curry');
        saveButton.click();
    });
});
