describe('Newsletter', function() {
    var first = true,
        form = element(by.css('[ng-controller="NewsletterController"] form')),
        success = element(by.css('[ng-controller="NewsletterController"] p[ng-show="success"]')),
        email = element(by.css('[ng-controller="NewsletterController"] input[type="email"]')),
        submit = element(by.css('[ng-controller="NewsletterController"] input[type="submit"]'));

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/');
        }
    });

    it('should start showing the form and not showing the success message', function() {
        expect(form.isDisplayed()).toBe(true);
        expect(success.isDisplayed()).toBe(false);
    });

    it('should allow the user to subscribe', function() {
        email.sendKeys('bunny@example.test');
        submit.click();
        expect(form.isDisplayed()).toBe(false);
        expect(success.isDisplayed()).toBe(true);
    });
});
