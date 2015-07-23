module.exports = {
    expectHasSomeEvents: function() {
        expect(element.all(by.css('cp-history-table tbody tr')).count()).toBeGreaterThan(0);
    }
};
