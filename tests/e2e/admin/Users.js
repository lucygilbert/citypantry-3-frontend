describe('Admin - users page', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject;
    var NUMBER_OF_FIXTURE_USERS = 7;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/users');
            isFirst = false;
            gridObject = new GridObjectTest('users-table');
        }
    });

    it('should have the title "Users"', function() {
        expect(element(by.css('h1')).getText()).toBe('Users');
    });

    it('should have ' + NUMBER_OF_FIXTURE_USERS + ' rows', function() {
        gridObject.expectRowCount(NUMBER_OF_FIXTURE_USERS);
    });

    it('should have 6 columns', function() {
        gridObject.expectHeaderColumns([
            'ID',
            'Name',
            'Email',
            'Group',
            'Last Login',
            'Action',
        ]);
    });

    it('should find 1 users when filtered by "Vendor"', function() {
        gridObject.enterFilterInColumn(1, 'Vendor');
        gridObject.expectRowCount(1);
        gridObject.expectCellValueMatch(0, 1, 'Vendor');
    });

    it('should find ' + NUMBER_OF_FIXTURE_USERS + ' users when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(1);
        gridObject.expectRowCount(NUMBER_OF_FIXTURE_USERS);
    });

    it('should allow the admin to masquerade as another user', function() {
        gridObject.enterFilterInColumn(1, 'Vendor');
        element(by.css('.masquerade')).click();

        // This sometimes fails without a `wait()`, because of the full-page reload I suspect.
        // Sometimes it passes though.
        browser.wait(function() {
            return browser.getCurrentUrl().then(function(url) {
                return /\.dev\/vendor\/orders$/.test(url);
            });
        }, 15000);
    });
});
