// TODO: Assert result of choosing these navigation options
// navMenuLinks.filter(elem => elem.getText().then(text => text === "MY ACCOUNT")).click();
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

        expect(navMenu.getText()).toContain('MY ACCOUNT');
        expect(navMenu.getText()).toContain('FAQ');
        expect(navMenu.getText()).toContain('EVENT QUOTE');
        expect(navMenu.getText()).toContain('Call us');
        expect(navMenuLinks.count()).toBe(4);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Orders');
        expect(myAccountMenu.getText()).toContain('Addresses');
        expect(myAccountMenu.getText()).toContain('Cards');
        expect(myAccountMenu.getText()).toContain('My details');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(5);
    });

    it('should present vendors with the appropriate navigation options', function() {
        loginAsUser('vendor@bunnies.test');

        expect(navMenu.getText()).toContain('MY ACCOUNT');
        expect(navMenu.getText()).toContain('ORDERS');
        expect(navMenu.getText()).toContain('ADDRESSES');
        expect(navMenu.getText()).toContain('PROFILE');
        expect(navMenu.getText()).toContain('PACKAGES');
        expect(navMenu.getText()).toContain('CREATE PACKAGE');
        expect(navMenuLinks.count()).toBe(6);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Delivery radiuses');
        expect(myAccountMenu.getText()).toContain('Supplier agreement');
        expect(myAccountMenu.getText()).toContain('My details');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(4);
    });

    it('should present staff with the appropriate navigation options', function() {
        loginAsUser('alice@bunnies.test');

        expect(navMenu.getText()).toContain('MY ACCOUNT');
        expect(navMenu.getText()).toContain('ORDERS');
        expect(navMenu.getText()).toContain('COURIER');
        expect(navMenu.getText()).toContain('INVOICES');
        expect(navMenu.getText()).toContain('PACKAGES');
        expect(navMenu.getText()).toContain('VENDORS');
        expect(navMenu.getText()).toContain('CUSTOMERS');
        expect(navMenu.getText()).toContain('USERS');
        expect(navMenuLinks.count()).toBe(8);

        expect(myAccountMenu.isDisplayed()).toBe(false);
        myAccountButton.click();
        expect(myAccountMenu.isDisplayed()).toBe(true);

        expect(myAccountMenu.getText()).toContain('Edit packages');
        expect(myAccountMenu.getText()).toContain('Edit vendors');
        expect(myAccountMenu.getText()).toContain('My details');
        expect(myAccountMenu.getText()).toContain('Log out');
        expect(myAccountMenuLinks.count()).toBe(4);
    });

    it('should present the default navigation options to people who aren\'t logged in', function() {
        logout();

        expect(navMenu.getText()).toContain('LOG IN / SIGN UP');
        expect(navMenu.getText()).toContain('FAQ');
        expect(navMenu.getText()).toContain('EVENT QUOTE');
        expect(navMenu.getText()).toContain('Call us');
        expect(navMenuLinks.count()).toBe(4);

        expect(myAccountMenu.isPresent()).toBe(false);
        expect(myAccountButton.isPresent()).toBe(false);
    });
});
