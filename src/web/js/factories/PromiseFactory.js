angular.module('cp.factories').factory('PromiseFactory', $q => {
    return {
        allResolved: promises => {
            return $q(resolve => {
                var resolveValues = [],
                    rejectCount = 0;

                const resolveIfAllSettled = () => {
                    const settledCount = resolveValues.length + rejectCount;

                    if (settledCount === promises.length) {
                        resolve(resolveValues);
                    }
                };

                promises.forEach(promise => {
                    promise.then(value => resolveValues.push(value))
                        .catch(() => rejectCount = rejectCount + 1)
                        .finally(resolveIfAllSettled);
                });
            });
        }
    };
});
