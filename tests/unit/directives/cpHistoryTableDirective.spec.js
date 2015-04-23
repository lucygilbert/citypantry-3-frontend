describe('cpHistoryTable directive controller', function() {
    'use strict';

    var scope;
    var makeCtrl;
    var ApiService;
    var NotificationService;
    var ApiService;
    var historyHttpRequest;

    beforeEach(function () {
        module('cp');
    });

    beforeEach(inject(function ($controller, $rootScope, _ApiService_, _NotificationService_) {
        scope = $rootScope.$new();
        ApiService = _ApiService_;
        NotificationService = _NotificationService_;

        makeCtrl = function () {
            $controller('cpHistoryTableController', {
                $scope: scope,
            });
        };

        historyHttpRequest = newPromise({history: 'value'});
        spyOn(ApiService, 'get').and.returnValue(historyHttpRequest);
    }));

    it('will not try to load history if there is no document ID', function() {
        makeCtrl();

        expect(scope.isLoaded).toBe(false);
        expect(ApiService.get).not.toHaveBeenCalled();
    });

    it('will load the history if there is a document ID and type, then set `isLoaded` to true', function() {
        scope.documentId = '123';
        scope.documentType = 'Package';

        makeCtrl();
        historyHttpRequest.resolveSuccess({history: 'value'});

        expect(scope.isLoaded).toBe(true);
        expect(scope.history).toBe('value');
        expect(ApiService.get).toHaveBeenCalled();
        expect(ApiService.get.calls.mostRecent().args[0]).toBe('/history/document?documentId=123&documentType=Package');
    });

    it('will load the history the document ID or type changes', function() {
        makeCtrl();

        expect(ApiService.get).not.toHaveBeenCalled();

        scope.documentId = '456';
        scope.documentType = 'Customer';
        scope.$apply();

        expect(ApiService.get).toHaveBeenCalled();
        expect(ApiService.get.calls.mostRecent().args[0]).toBe('/history/document?documentId=456&documentType=Customer');
    });
});
