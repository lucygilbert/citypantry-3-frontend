describe('Admin - meal plan dashboard', function() {
    var GridObjectTest = require('../lib/gridObjectTestUtils.spec.js');
    var isFirst = true;
    var gridObject;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/meal-plan');
            isFirst = false;
            gridObject = new GridObjectTest('meal-plan-table');
        }
    });

    it('should have the title "Meal plan"', function() {
        expect(element(by.css('h1')).getText()).toBe('Meal plan');
    });

    it('should have 6 columns', function() {
        gridObject.expectHeaderColumns([
            'ID',
            'Company Name',
            'Status',
            'Current Meal Plan Status',
            'Last Meal Plan End Date',
            'Action',
        ]);
    });

    it('should have 2 rows', function() {
        gridObject.expectRowCount(2);
    });

    it('should find 1 customer when filtered by "Apple"', function() {
        gridObject.enterFilterInColumn(1, 'Apple');
        gridObject.expectRowCount(1);
        gridObject.expectCellValueMatch(0, 1, 'Apple');
    });

    it('should find 2 customers when filter is cancelled', function() {
        gridObject.cancelFilterInColumn(1);
        gridObject.expectRowCount(2);
    });

    it('should find 1 customer when the "Show new meal plan customers" button is clicked', function() {
        element(by.css('main button[ng-click^="showNewMealPlanCustomers()"]')).click();
        gridObject.expectRowCount(1);
    });
});
