angular.module('cp.services').service('DocumentTitleService', function($document) {
    return newTitle => {
        newTitle = newTitle + ' | City Pantry';

        $document.title = newTitle;
        $document.querySelector('head > title').textContent = newTitle;
    };
});
