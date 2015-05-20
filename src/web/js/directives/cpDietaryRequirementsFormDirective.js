angular.module('cp').directive('cpDietaryRequirementsForm', function(getTemplateUrl) {
    return {
        restrict: 'E',
        scope: {
            model: '=cpModel',
            maxHeadCount: '=cpMaxHeadCount'
        },
        templateUrl: getTemplateUrl('directives/cp-dietary-requirements-form.html'),
        controller: 'cpDietaryRequirementsFormController'
    };
});

angular.module('cp').controller('cpDietaryRequirementsFormController', function($scope, PackagesFactory,
        NotificationService, OrdersFactory) {
    const DEFAULT_MAX_HEAD_COUNT = 40;

    PackagesFactory.getDietaryTypes()
        .success((response) => {
            $scope.options = response.dietaryRequirements;
            $scope.isLoaded = true;
        })
        .catch(() => NotificationService.notifyError('Could not load dietary requirements.'));

    // A max head count will be known when editing an existing order. In this case, the max
    // head count for any dietary requirement should be the order's head count.
    // A max head count will not be known when collecting meal plan requirements. In this
    // case, the max head count for any dietary requirement should be a sensible guess.
    const maxHeadCount = (parseInt($scope.maxHeadCount, 10) > 0 ?
        parseInt($scope.maxHeadCount, 10) :
        DEFAULT_MAX_HEAD_COUNT);
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(maxHeadCount, 0);

    $scope.addMore = () => {
        $scope.model.requirements.push({
            headCount: 0,
            requirementIds: []
        });
    };

    const setIds = (model) => {
        model.requirements.forEach((group) => {
            group.requirementIds = group.requirements.map((requirement) => requirement.id);
        });
    };

    /**
     * Add a function to the model that returns the dietary requirements structured in the way that
     * the API's `DietaryRequirementService::createDietaryRequirementCollectionFromArray()` expects.
     */
    const addApiCallMethod = (model) => {
        model.getStructuredForApiCall = () => {
            return {
                // `$scope.model` is used deliberately here instead of just `model`.
                customInstructions: $scope.model.customInstructions,
                requirements: $scope.model.requirements
                    .map((group) => ({
                        headCount: parseInt(group.headCount, 10),
                        requirements: group.requirementIds
                    }))
                    .filter((group) => group.headCount > 0)
            };
        };
    };

    const prepare = (model) => {
        addApiCallMethod(model);
        setIds(model);
        model.isPrepared = true;
    };

    prepare($scope.model);

    $scope.$watch('model', (newValue) => {
        if (newValue.isPrepared) {
            return;
        }

        prepare(newValue);
    });
});
