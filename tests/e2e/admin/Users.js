describe('Admin - users page', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/users');
            isFirst = false;
        }
    });

    it('should have the title "Users"', function() {
        expect(element(by.css('h1')).getText()).toBe('Users');
    });

    it('should have 6 rows', function() {
        gridTestUtils.expectRowCount('users-table', 6);
    });

    it('should have 6 columns', function() {
        gridTestUtils.expectHeaderColumnCount('users-table', 6);
        gridTestUtils.expectHeaderCellValueMatch('users-table', 0, 'ID');
        gridTestUtils.expectHeaderCellValueMatch('users-table', 1, 'Name');
        gridTestUtils.expectHeaderCellValueMatch('users-table', 2, 'Email');
        gridTestUtils.expectHeaderCellValueMatch('users-table', 3, 'Group');
        gridTestUtils.expectHeaderCellValueMatch('users-table', 4, 'Last Login');
        gridTestUtils.expectHeaderCellValueMatch('users-table', 5, 'Action');
    });

    it('should find 1 users when filtered by "Vendor"', function() {
        gridTestUtils.enterFilterInColumn('users-table', 1, 'Vendor');
        gridTestUtils.expectRowCount('users-table', 1);
        gridTestUtils.expectCellValueMatch('users-table', 0, 1, 'Vendor');
    });

    it('should find 6 users when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('users-table', 1);
        gridTestUtils.expectRowCount('users-table', 6);
    });

    it('should allow the admin to masquerade as another user', function() {
        gridTestUtils.enterFilterInColumn('users-table', 1, 'Vendor');
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
