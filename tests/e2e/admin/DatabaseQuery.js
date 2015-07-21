describe('Admin - mass edit vendors page', function() {
    var isFirst = true;
    var queryInput;
    var sendButton;
    var output;

    beforeEach(function() {
        if (isFirst) {
            loginAsUser('alice@bunnies.test');
            browser.get('/admin/database-query');
            isFirst = false;
        }

        queryInput = element(by.css('textarea'));
        sendButton = element(by.css('.cp-database-query > .btn-primary'));
        output = element(by.css('pre'));
    });

    it('should query the database', function() {
        queryInput.sendKeys('db.User.find().count()');
        sendButton.click();
        expect(output.getAttribute('innerHTML')).toContain('7');
    });
});
