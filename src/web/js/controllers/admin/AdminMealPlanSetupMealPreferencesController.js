angular.module('cp.controllers.admin').controller('AdminMealPlanSetupMealPreferencesController',
        function($scope, $location, $routeParams, $q, $window, DocumentTitleService, SecurityService, ApiService,
        LoadingService, NotificationService, CustomersFactory, MealPlanFactory, OrdersFactory, PackagesFactory) {
    DocumentTitleService('Meal preferences');
    SecurityService.requireStaff();

    $scope.preferences = {
        cuisineTypes: [],
        deliveryDays: [],
        dietaryRequirements: {
            customInstructions: null,
            requirements: []
        },
        duration: undefined,
        eventType: undefined,
        headCount: undefined,
        isCutleryAndServiettesRequired: false,
        isToBeCateredOnBankHolidays: undefined,
        isVendorRequiredToCleanUp: false,
        isVendorRequiredToSetUp: false,
        maxBudget: 50,
        minBudget: 1,
        packageDispositions: {},
        packagingType: undefined,
        time: undefined
    };

    $scope.cuisineTypes = [];
    $scope.customer = {};
    $scope.daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.dietaryRequirements = [];
    $scope.eventTypes = [];
    $scope.headCountOptions = OrdersFactory.getHeadCountOptions(500, 1);
    $scope.isDatePickerOpen = false;
    $scope.minDate = new Date();
    $scope.packageDispositionOptions = PackagesFactory.getPackageDispositionOptions();
    $scope.packagingTypeOptions = PackagesFactory.getPackagingTypeChoiceOptions();
    $scope.timeOptions = PackagesFactory.getPackageDeliveryTimeOptions(700, 2400, 30);

    function init() {
        const initPromises = [];

        initPromises[0] = PackagesFactory.getEventTypes()
            .success(response => $scope.eventTypes = response.eventTypes)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        initPromises[1] = PackagesFactory.getCuisineTypes()
            .success(response => $scope.cuisineTypes = response.cuisineTypes)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        initPromises[2] = PackagesFactory.getDietaryTypes()
            .success(response => $scope.dietaryRequirements = response.dietaryRequirements)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        initPromises[3] = CustomersFactory.getCustomer($routeParams.customerId)
            .success(response => $scope.customer = response)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        initPromises[4] = MealPlanFactory.getCustomerMealPlanRequirements($routeParams.customerId)
            .success(response => {
                $scope.preferences = response.requirements;
                $scope.preferences.isToBeCateredOnBankHolidaysString = $scope.preferences.isToBeCateredOnBankHolidays ?
                    'true' : 'false';
                $scope.preferences.eventTypeId = $scope.preferences.eventType ?
                    $scope.preferences.eventType.id :
                    null;

                if ($scope.preferences.cuisineTypes) {
                    $scope.preferences.cuisineTypeIds = $scope.preferences.cuisineTypes
                        .map(cuisineType => cuisineType.id);
                } else {
                    $scope.preferences.cuisineTypeIds = [];
                }

                // The preferences are stored in the API as an object with the key being a human ID
                // and the value being a disposition. That doesn't work well with Angular forms,
                // so convert the object to an array for ease-of-use.
                $scope.preferences.packageDispositionsArray = [];
                angular.forEach($scope.preferences.packageDispositions, (disposition, packageId) => {
                    $scope.preferences.packageDispositionsArray.push({packageId, disposition});
                });
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all(initPromises).then(() => LoadingService.hide());
    }

    init();

    $scope.toggleDayForDelivery = day => {
        const index = $scope.preferences.deliveryDays.indexOf(day);

        if (index > -1) {
            $scope.preferences.deliveryDays.splice(index, 1);
        } else {
            $scope.preferences.deliveryDays.push(day);
        }
    };

    $scope.addDisposition = () => {
        $scope.preferences.packageDispositionsArray.push({packageId: null, disposition: null});
    };

    const isSet = (input) => input !== null &&
        input !== 'null' &&
        input !== undefined &&
        input !== '';

    // Whether some fields are true (boolean) or 'true' (string) depends on whether they have
    // been set by Angular on model changes or if they have been set from the API and not
    // changed.
    const isTrueBooleanOrString = (input) => input === true || input === 'true';

    $scope.nextStep = () => {
        if ($scope.mealPlanSetupForm.$invalid) {
            $scope.mealPlanSetupForm.$submitted = true;
            return;
        }

        LoadingService.show();

        const packageDispositions = {};
        const packageDispositionIdPromises = [];
        let hasErrors = false;

        angular.forEach($scope.preferences.packageDispositionsArray, packageIdAndDisposition => {
            const packageId = packageIdAndDisposition.packageId;
            const disposition = packageIdAndDisposition.disposition;

            if (!isSet(disposition) || !isSet(packageId)) {
                return;
            }

            if (packageId.length === 24) {
                packageDispositions[packageId] = parseInt(disposition, 10);
                return;
            }

            const promise = PackagesFactory.getPackageByHumanId(parseInt(packageId, 10))
                .success(response => {
                    packageDispositions[response.id] = parseInt(disposition, 10);
                })
                .catch(response => {
                    hasErrors = true;
                    NotificationService.notifyError(response.data.errorTranslation);
                });
            packageDispositionIdPromises.push(promise);
        });

        $q.all(packageDispositionIdPromises).then(() => {
            if (hasErrors) {
                return;
            }

            const mealPlanRequirements = {
                cuisineTypes: $scope.preferences.cuisineTypeIds,
                deliveryDays: $scope.preferences.deliveryDays,
                dietaryRequirements: $scope.preferences.dietaryRequirements.getStructuredForApiCall(),
                duration: parseInt($scope.preferences.duration, 10),
                eventType: $scope.preferences.eventTypeId,
                headCount: parseInt($scope.preferences.headCount, 10),
                isToBeCateredOnBankHolidays: isTrueBooleanOrString($scope.preferences.isToBeCateredOnBankHolidaysString),
                maxBudget: parseInt($scope.preferences.maxBudget, 10),
                minBudget: parseInt($scope.preferences.minBudget, 10),
                packageDispositions: packageDispositions,
                packagingTypeChoice: parseInt($scope.preferences.packagingTypeChoice, 10),
                requestCutleryAndServiettes: $scope.preferences.requestCutleryAndServiettes,
                requestVendorSetUpAfterDelivery: isTrueBooleanOrString($scope.preferences.requestVendorSetUpAfterDelivery),
                requestVendorCleanUpAfterDelivery: isTrueBooleanOrString($scope.preferences.requestVendorCleanUpAfterDelivery),
                time: parseInt($scope.preferences.time, 10)
            };

            MealPlanFactory.setCustomerMealPlanRequirements($routeParams.customerId, mealPlanRequirements)
                .success(response => $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/setup/delivery-details`))
                .catch(response => NotificationService.notifyError(response.data.errorTranslation));
        });
    };

    $scope.getPackageName = (packageDisposition) => {
        PackagesFactory.getPackageName(packageDisposition.packageId)
            .then(packageName => packageDisposition.packageName = packageName)
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
