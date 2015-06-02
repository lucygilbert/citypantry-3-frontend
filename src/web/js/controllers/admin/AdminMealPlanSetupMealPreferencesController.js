angular.module('cp.controllers.admin').controller('AdminMealPlanSetupMealPreferencesController',
        function($scope, $location, $routeParams, $q, $window, DocumentTitleService, SecurityService, ApiService,
        LoadingService, NotificationService, CustomersFactory, MealPlanFactory, OrdersFactory, PackagesFactory) {
    DocumentTitleService('Meal preferences');
    SecurityService.requireStaff();

    const setupOrEdit = $location.path().slice($location.path().lastIndexOf('/') + 1);

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
        packageDispositions: [{}],
        packagingType: undefined,
        startDate: undefined,
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

        if (setupOrEdit === 'edit') {
            initPromises[4] = ApiService.get('/meal-plan/customers/' + $routeParams.customerId + '/requirements', ApiService.getAuthHeaders())
                .success(response => {
                    $scope.preferences = response.requirements;
                    $scope.preferences.isToBeCateredOnBankHolidays = $scope.preferences.isToBeCateredOnBankHolidays ?
                        'true' : 'false';
                    $scope.preferences.eventTypeId = $scope.preferences.eventType.id;
                    $scope.preferences.cuisineTypeIds = $scope.preferences.cuisineTypes.map(cuisineType => {
                        return cuisineType.id;
                    });
                }).catch(response => NotificationService.notifyError(response.data.errorTranslation));
        }

        $q.all(initPromises).then(() => {
            $scope.cuisineTypes.forEach(cuisineType => {
                $scope.preferences.cuisineTypes.push(cuisineType.id);
            });

            $scope.preferences.packagingType = $scope.packagingTypeOptions[0].value; // "Individual portions".

            LoadingService.hide();
        });
    }

    init();

    $scope.$watch('pickedDate', (date, oldDate) => {
        if (typeof date === 'undefined') {
            return;
        }
        if (date === oldDate) {
            return;
        }

        if (date === null) {
            $scope.preferences.startDate = undefined;
        } else {
            // The date will be a string if the date picker was set manually.
            if (typeof date === 'string') {
                const bits = date.split(/\D/);
                $scope.preferences.startDate = new Date(bits[2], bits[1] - 1, bits[0]);
            } else {
                $scope.preferences.startDate = date;
            }
        }
    });

    $scope.openDatePicker = $event => {
        // Need to call these, otherwise the popup won't open (a click outside
        // of the popup closes it).
        $event.preventDefault();
        $event.stopPropagation();

        $scope.isDatePickerOpen = true;
    };

    $scope.toggleDayForDelivery = day => {
        const index = $scope.preferences.deliveryDays.indexOf(day);

        if (index > -1) {
            $scope.preferences.deliveryDays.splice(index, 1);
        } else {
            $scope.preferences.deliveryDays.push(day);
        }
    };

    $scope.nextStep = () => {
        if ($scope.mealPlanSetupForm.$invalid) {
            $scope.mealPlanSetupForm.$submitted = true;
            return;
        }

        LoadingService.show();

        $window.localStorage.setItem('startDate', $scope.preferences.startDate.toISOString());

        const packageDispositions = {};
        const promises = [];
        let hasErrors = false;

        $scope.preferences.packageDispositions.forEach(packageDisposition => {
            const packageHumanIdIsSet = packageDisposition.packageHumanId !== null &&
                packageDisposition.packageHumanId !== undefined;
            const packageDispositionIsSet = packageDisposition.disposition !== null &&
                packageDisposition.disposition !== undefined;

            if (!packageHumanIdIsSet || !packageDispositionIsSet) {
                return;
            }

            const promise = PackagesFactory.getPackageByHumanId(packageDisposition.packageHumanId)
                .success(response => {
                    packageDispositions[response.id] = packageDisposition.disposition;
                })
                .catch(response => {
                    hasErrors = true;
                    NotificationService.notifyError(response.data.errorTranslation);
                });
            promises.push(promise);
        });

        const mealPlanRequirements = {
            cuisineTypes: $scope.preferences.cuisineTypes,
            deliveryDays: $scope.preferences.deliveryDays,
            dietaryRequirements: $scope.preferences.dietaryRequirements.getStructuredForApiCall(),
            duration: parseInt($scope.preferences.duration, 10),
            eventType: $scope.preferences.eventType,
            headCount: $scope.preferences.headCount,
            isToBeCateredOnBankHolidays: $scope.preferences.isToBeCateredOnBankHolidays === 'true',
            maxBudget: parseInt($scope.preferences.maxBudget, 10),
            minBudget: parseInt($scope.preferences.minBudget, 10),
            packageDispositions: packageDispositions,
            packagingTypeChoice: $scope.preferences.packagingType,
            requestCutleryAndServiettes: $scope.preferences.isCutleryAndServiettesRequired,
            requestVendorSetUpAfterDelivery: $scope.preferences.isVendorRequiredToSetUp === 'true',
            requestVendorCleanUpAfterDelivery: $scope.preferences.isVendorRequiredToCleanUp === 'true',
            time: $scope.preferences.time
        };

        $q.all(promises).then(() => {
            if (!hasErrors) {
                MealPlanFactory.setCustomerMealPlanRequirements($routeParams.customerId, mealPlanRequirements)
                    .success(response => {
                        $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/setup/delivery-details`);
                    })
                    .catch(response => NotificationService.notifyError(response.data.errorTranslation));
            }
        });
    };
});
