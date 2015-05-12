angular.module('cp.services', []);

/**
 * This is a service to help run A/B tests. The service has methods named e.g.
 * `isAllowedToSeeDashboardAndSearchResultsWhenLoggedOut` which return one of multiple possible
 * options. The chosen option is persisted across requests in local storage.
 *
 * Each direct service method also has an 'addEvent' method.
 */
angular.module('cp.services').service('ABTestService', function($q, ApiService) {
    const choose = (options) => randy.good.choice(options);

    const registerStart = (test, options, choice) => {
        ApiService.post('/ab-test/start', {test, options, choice})
            .success((response) => localStorage.setItem('ABTestServiceStart-' + test, response.id));
    };

    const getExistingChoiceOrChoose = (test, options) => {
        const localStorageKey = 'ABTestService-' + test;

        let choice = localStorage.getItem(localStorageKey);
        if (choice !== null && choice !== undefined) {
            return JSON.parse(choice);
        }

        choice = choose(options);

        registerStart(test, options, choice);

        localStorage.setItem(localStorageKey, JSON.stringify(choice));

        return choice;
    };

    // A hash of {test: options}. Each `test` will be made available as a service method.
    const tests = {
    };

    const service = {};

    for (let test in tests) {
        /**
         * @return {mixed} One of the test's possible options.
         */
        service[test] = () => getExistingChoiceOrChoose(test, tests[test]);

        /**
         * The `addEvent` method adds an 'event' and relates it to the 'start' of the A/B test.
         * If the A/B test has no 'start', this method does nothing.
         *
         * @param  {String}  event
         * @param  {Object}  details
         * @return {Promise}
         */
        service[test].addEvent = (event, details) => {
            const start = localStorage.getItem('ABTestServiceStart-' + test);
            if (!start) {
                const noop = $q.defer();
                noop.resolve();
                return noop.promise;
            }

            return ApiService.post('/ab-test/event', {event, details, start});
        };
    }

    return service;
});
