angular.module('cp.controllers.admin').controller('AdminMealPlanSetupMealPreferencesController',
        function($scope, $location, $routeParams, $q, $window, DocumentTitleService, SecurityService,
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
        const promise1 = PackagesFactory.getEventTypes()
            .success(response => {
                $scope.eventTypes = response.eventTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise2 = PackagesFactory.getCuisineTypes()
            .success(response => {
                $scope.cuisineTypes = response.cuisineTypes;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise3 = PackagesFactory.getDietaryTypes()
            .success(response => {
                $scope.dietaryRequirements = response.dietaryRequirements;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        const promise4 = CustomersFactory.getCustomer($routeParams.customerId)
            .success(response => {
                $scope.customer = response;
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));

        $q.all([promise1, promise2, promise3, promise4]).then(() => {
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

        $scope.preferences.packageDispositions.forEach(packageDisposition => {
            packageDispositions[packageDisposition.packageId] = packageDisposition.disposition;
        });

        const mealPlanPreferences = {
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

        MealPlanFactory.updateMealPlanPreferences($routeParams.customerId, mealPlanPreferences)
            .success(response => {
                $location.path(`/admin/meal-plan/customer/${$routeParams.customerId}/setup/delivery-details`);
            })
            .catch(response => NotificationService.notifyError(response.data.errorTranslation));
    };
});
