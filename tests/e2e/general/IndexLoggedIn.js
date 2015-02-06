describe('Index as a logged in user', function() {
    it('should show admin users the admin navigation', function() {
        loginAsUser('alice@bunnies.test');

        var links = element.all(by.css('#main-menu > ul > li'));
        expect(links.get(0).getText()).toContain('My account');
        expect(links.get(1).getText()).toBe('Orders');
        expect(links.get(2).getText()).toBe('Courier');
        expect(links.count()).toBe(7);
    });

    it('should show customer users the customer navigation', function() {
        loginAsUser('customer@bunnies.test');

        var links = element.all(by.css('#main-menu > ul > li'));
        expect(links.get(0).getText()).toContain('My account');
        expect(links.get(1).getText()).toBe('FAQ');
        expect(links.get(2).getText()).toBe('Event quote');
        expect(links.count()).toBe(4);

        var myAccountDropdown = element(by.css('#main-menu > ul > li.dropdown'));
        var dropdownLinks = element.all(by.css('#main-menu > ul > li.dropdown li'));

        // The 'My Account' dropdown should open on click.
        expect(dropdownLinks.get(0).isDisplayed()).toBe(false);
        myAccountDropdown.click();
        expect(dropdownLinks.get(0).isDisplayed()).toBe(true);

        expect(dropdownLinks.get(0).getText()).toBe('Orders');
        expect(dropdownLinks.get(1).getText()).toBe('Addresses');
        expect(dropdownLinks.get(2).getText()).toBe('Cards');
        expect(dropdownLinks.get(3).getText()).toBe('My details');
        expect(dropdownLinks.get(4).getText()).toBe('Log out');
        expect(dropdownLinks.count()).toBe(5);
    });

    it('should show vendor users the vendor navigation', function() {
        loginAsUser('vendor@bunnies.test');

        var links = element.all(by.css('#main-menu > ul > li'));
        expect(links.count()).toBe(1);
        expect(links.get(0).getText()).toContain('My account');

        var myAccountDropdown = element(by.css('#main-menu > ul > li.dropdown'));
        var dropdownLinks = element.all(by.css('#main-menu > ul > li.dropdown li'));

        // The 'My Account' dropdown should open on click.
        expect(dropdownLinks.get(0).isDisplayed()).toBe(false);
        myAccountDropdown.click();
        expect(dropdownLinks.get(0).isDisplayed()).toBe(true);

        expect(dropdownLinks.get(0).getText()).toBe('Orders');
        expect(dropdownLinks.get(1).getText()).toBe('Profile');
        expect(dropdownLinks.get(2).getText()).toBe('Packages');
        expect(dropdownLinks.get(3).getText()).toBe('Create package');
        expect(dropdownLinks.get(4).getText()).toBe('Supplier agreement');
        expect(dropdownLinks.get(5).getText()).toBe('My details');
        expect(dropdownLinks.get(6).getText()).toBe('Log out');
        expect(dropdownLinks.count()).toBe(7);
    });
});
