angular.module('cp.controllers.admin').controller('AdminSmsCentreController',
        function ($scope, ApiService, LoadingService, DocumentTitleService,
        NotificationService, SmsFactory, CP_TWILIO_SMS_CENTRE_NUMBER, CP_TWILIO_ORDER_DELIVERY_NUMBER) {
    DocumentTitleService('SMS Centre');
    $scope.mainPage = 'inbox';
    $scope.inboxPage = 'list';
    $scope.sentboxPage = 'list';
    $scope.newMessage = {};

    function init() {
        $scope.inbox = [];
        $scope.orderDeliveryReplies = [];
        $scope.sentbox = [];
        SmsFactory.getSmsHistory().success((response) => {
            $scope.sms = response.sms;
            $scope.sms.forEach((element, index, array) => {
                element.summary = element.body.length > 30 ? element.body.slice(0, 30) + '...' : element.body;
                if (element.to === CP_TWILIO_SMS_CENTRE_NUMBER) {
                    $scope.inbox.push(element);
                } else if (element.to === CP_TWILIO_ORDER_DELIVERY_NUMBER) {
                    $scope.orderDeliveryReplies.push(element);
                } else {
                    $scope.sentbox.push(element);
                }
            });
            LoadingService.hide();
        }).catch((response) => {
            NotificationService.notifyError(response.data.errorTranslation);
        });
    }

    init();

    $scope.viewMessage = (message) => {
        $scope.selected = message;
        if ($scope.mainPage === 'inbox') {
            $scope.inboxPage = 'view';
        } else {
            $scope.sentboxPage = 'view';
        }
    };

    $scope.sendMessage = () => {
        SmsFactory.sendSms($scope.newMessage).success((response) => {
            NotificationService.notifySuccess('Message sent.');
            $scope.newMessage.toNumber = '';
            $scope.newMessage.message = '';
            LoadingService.show();
            init();
        }).catch((response) => {
            NotificationService.notifyError('Failed to send message.');
        });
    };

    $scope.goToList = () => $scope.mainPage === 'inbox' ? $scope.inboxPage = 'list' : $scope.sentboxPage = 'list';

    $scope.goToPage = (page) => {
        $scope.mainPage = page;
        $scope.selected = null;
        $scope.inboxPage = 'list';
        $scope.sentboxPage = 'list';
    };

    $scope.replyToMessage = (message) => {
        $scope.mainPage = 'send';
        $scope.selected = null;
        $scope.newMessage.toNumber = message.from;
    };
});
