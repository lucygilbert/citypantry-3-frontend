// @todo - fix these tests.
xdescribe('Admin - meal plan dashboard', function() {
    var gridTestUtils = require('../lib/gridTestUtils.spec.js');
    var isFirst = true;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/meal-plan');
            isFirst = false;
        }
    });

    it('should have the title "Meal plan"', function() {
        expect(element(by.css('h1')).getText()).toBe('Meal plan');
    });

    it('should have 6 columns', function() {
        gridTestUtils.expectHeaderColumnCount('meal-plan-table', 6);
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 0, 'ID');
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 1, 'Company Name');
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 2, 'Status');
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 3, 'Current Meal Plan Status');
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 4, 'Last Meal Plan End Date');
        gridTestUtils.expectHeaderCellValueMatch('meal-plan-table', 5, 'Action');
    });

    it('should have 2 rows', function() {
        gridTestUtils.expectRowCount('meal-plan-table', 2);
    });

    it('should find 1 customer when filtered by "Apple"', function() {
        gridTestUtils.enterFilterInColumn('meal-plan-table', 1, 'Apple');
        gridTestUtils.expectRowCount('meal-plan-table', 1);
        gridTestUtils.expectCellValueMatch('meal-plan-table', 0, 1, 'Apple');
    });

    it('should find 2 customers when filter is cancelled', function() {
        gridTestUtils.cancelFilterInColumn('meal-plan-table', 1);
        gridTestUtils.expectRowCount('meal-plan-table', 2);
    });

    it('should find 1 customer when the "Show new meal plan customers" button is clicked', function() {
        element(by.css('main button[ng-click^="showNewMealPlanCustomers()"]')).click();
        gridTestUtils.expectRowCount('meal-plan-table', 1);
    });
});
