describe('Vendor portal - your packages', function() {
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('vendor@bunnies.test');
            browser.get('/vendor/packages');
            isFirst = false;
        }
    });

    it('should show the "Your packages" page', function() {
        expect(element(by.css('h1')).getText()).toBe('Your packages');
    });

    it('should have a button to create a new package', function() {
        var createPackageButton = element(by.css('main a.create-package'));
        expect(createPackageButton.isDisplayed()).toBe(true);
        expect(createPackageButton.getText()).toBe('Create package');
    });

    it('should have two packages', function() {
        var packages = element.all(by.repeater('package in packages'));
        expect(packages.count()).toBe(2);
        expect(packages.get(0).getText()).toContain('Carrots');
        expect(packages.get(1).getText()).toContain('Marshmallows');
    });

    // @todo - fix this test.
    xit('should be able to delete a package', function() {
        // spyOn(window, 'confirm').and.callFake(() => {
        //      return true;
        // });

        var actionsCell = element.all(by.css('#table_packages .dropdown')).get(0);
        element.all(by.css(actionsCell + ' > a.btn')).click();
        expect(element(actionsCell).isDisplayed()).toBe(true);

        element.all(by.css(actionsCell + ' a[ng-click^="delete"]')).click();

        var packages = element.all(by.repeater('package in packages'));
        expect(packages.count()).toBe(1);
        expect(packages.get(0).getText()).toContain('Marshmallows');
    });
});
