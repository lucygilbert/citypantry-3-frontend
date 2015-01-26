describe('Contact', function() {
    var first = true,
        emailModal,
        thanksModal;

    beforeEach(function() {
        if (first) {
            first = false;
            browser.get('/contact');
        }

        emailModal = element(by.id('contact-modal'));
        thanksModal = element(by.id('thanks-modal'));
    });

    it('should show the "contact" page', function() {
        expect(element(by.css('main > div > div > div > h1')).getText()).toBe('Contact us');
    });

    it('should highlight the "contact" link in the sidebar', function() {
        var activeLinks = element.all(by.css('.sidebar-menu li.active'));
        expect(activeLinks.count()).toBe(1);
        expect(activeLinks.first().getText()).toBe('Contact');
    });

    it('should show the email modal when a link is clicked', function() {
        expect(emailModal.isDisplayed()).toBe(false);
        element(by.css('[ng-click="showModal()"]')).click();
        expect(emailModal.isDisplayed()).toBe(true);
    });

    it('should submit the email form then display the "thanks" modal', function() {
        emailModal.element(by.model('name')).sendKeys('Bob');
        emailModal.element(by.model('email')).sendKeys('bob@example.test');
        emailModal.element(by.model('message')).sendKeys('My message');
        emailModal.element(by.css('#contact-modal .btn-primary')).click();
        expect(emailModal.isDisplayed()).toBe(false);
        expect(thanksModal.isDisplayed()).toBe(true);
    });
});
