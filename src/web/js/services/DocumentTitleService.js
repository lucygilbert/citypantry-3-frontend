angular.module('cp.services', []);

angular.module('cp.services').service('DocumentTitleService', function($document) {
    return newTitle => {
        newTitle = newTitle + ' | City Pantry';

        $document[0].title = newTitle;
        $document[0].querySelector('head > title').textContent = newTitle;
    };
});
