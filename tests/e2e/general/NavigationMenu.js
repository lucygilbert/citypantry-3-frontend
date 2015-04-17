describe('Navigation Menu', function() {
    var navMenu, navMenuLinks, myAccountButton, myAccountMenu, myAccountMenuLinks;

    beforeEach(function() {
        navMenu = element(by.css('.cp-nav-menu'));
        navMenuLinks = element.all(by.css('.cp-nav-menu > li > a'));
        myAccountButton = element(by.css('.cp-button-my-account'));
        myAccountMenu = element(by.css('.cp-nav-menu-my-account'));
        myAccountMenuLinks = element.all(by.css('.cp-nav-menu-my-account > li > a'));
    });

    it('should present customers with the appropriate navigation options', function() {
        loginAsUser('customer@bunnies.test');

        expect(navMenu.getText()).toContain('Dashboard');
        expect(navMenu.getText()).toContain('My account');
        expect(navMenu.getText()).toContain('020');
        expect(navMenuLinks.count()).toBe(3);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Account details');
        expect(myAccountMenu.getText()).toContain('Orders');
        expect(myAccountMenu.getText()).toContain('Addresses');
        expect(myAccountMenu.getText()).toContain('Cards');
        expect(myAccountMenu.getText()).toContain('Password');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(6);

        // 'Pay on account' should not be in the menu because customer@bunnies.test is not enabled
        // for that feature.
        expect(myAccountMenu.getText()).not.toContain('Pay on account');
    });

    it('should present customers who have "pay on account" enabled with that menu item', function() {
        loginAsUser('customer@apple.test');
        myAccountButton.click();
        expect(myAccountMenu.getText()).toContain('Pay on account');
    });

    it('should present vendors with the appropriate navigation options', function() {
        loginAsUser('vendor@bunnies.test');

        expect(navMenu.getText()).toContain('My account');
        expect(navMenu.getText()).toContain('Orders');
        expect(navMenu.getText()).toContain('Addresses');
        expect(navMenu.getText()).toContain('Profile');
        expect(navMenu.getText()).toContain('Packages');
        expect(navMenu.getText()).toContain('Create package');
        expect(navMenu.getText()).toContain('020');
        expect(navMenuLinks.count()).toBe(7);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Delivery radiuses');
        expect(myAccountMenu.getText()).toContain('Holidays');
        expect(myAccountMenu.getText()).toContain('Supplier agreement');
        expect(myAccountMenu.getText()).toContain('Password');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(5);
    });

    it('should present staff with the appropriate navigation options', function() {
        loginAsUser('alice@bunnies.test');

        expect(navMenu.getText()).toContain('My account');
        expect(navMenu.getText()).toContain('Orders');
        expect(navMenu.getText()).toContain('Courier');
        expect(navMenu.getText()).toContain('Invoices');
        expect(navMenu.getText()).toContain('Packages');
        expect(navMenu.getText()).toContain('Vendors');
        expect(navMenu.getText()).toContain('Customers');
        expect(navMenu.getText()).toContain('Users');
        expect(navMenuLinks.count()).toBe(8);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Edit packages');
        expect(myAccountMenu.getText()).toContain('Edit vendors');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(3);
    });

    it('should present the default navigation options to people who aren\'t logged in', function() {
        logout();

        expect(navMenu.getText()).toContain('Log in / sign up');
        expect(navMenu.getText()).toContain('FAQ');
        expect(navMenu.getText()).toContain('Event quote');
        expect(navMenu.getText()).toContain('020');
        expect(navMenuLinks.count()).toBe(4);

        expect(myAccountMenu.isPresent()).toBe(false);
        expect(myAccountButton.isPresent()).toBe(false);
    });
});
