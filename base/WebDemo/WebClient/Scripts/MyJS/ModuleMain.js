var app;
(function () {
    app = angular.module("myApp", ['ui.router', 'ngMessages']);

    //cấu hình điều hướng
    app.config(['$stateProvider', '$locationProvider', '$qProvider', '$compileProvider', '$urlRouterProvider',
        function ($stateProvider, $locationProvider, $qProvider, $compileProvider, $urlRouterProvider) {
            $compileProvider.debugInfoEnabled(true);
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|sms|file|skype|callto):/);
            $locationProvider.hashPrefix('');

            $urlRouterProvider.otherwise("List");

            $stateProvider.state("List", {
                url: "/List",
                templateUrl: "/Home/List",
                params: {
                    params: ''
                },
                titlestate: "List"
            }),
                $stateProvider.state("ChiTiet", {
                    url: "/ChiTiet",
                    templateUrl: "/Home/ChiTiet",
                    params: {
                        params: '',
                        chitiet:''
                    },
                    titlestate: "ChiTiet"
                })
        }]);

    //Điều hướng
    app.config(['$qProvider', function ($qProvider) {
        $qProvider.errorOnUnhandledRejections(false);
    }]);
    app.run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.$on("$routeChangeSuccess", function (event, currentRoute, previousRoute) {
            });
        }]);
    var options = {
        FORMAT_DATE: "dd/MM/yyyy",
        FORMAT_TIEN: "###,###,###,###",
        FORMAT_GIA: "###,###,###",
        FORMAT_SL: "###,###,###.00",
        FORMAT_HESO: "###.0000",
        R_PC_NGHIN: ".",
        R_PC_THAPPHAN: ",",
        DATE_BREAK: "",
        FORMAT_PHONE: "-",
        PAGING_LIMIT: 50,
        CURRENT_DATA: "",

    }

    localStorage.options = JSON.stringify(options);

})();