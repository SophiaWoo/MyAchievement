'use strict';

// 配置路由信息,
// 用angularjs的路由模块实现无刷新页面切换
// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/index',  // 打开链接为"/"，载入默认的空白视图
        controller: IndexCtrl
      }).
      when('/changePassword', {
        templateUrl: 'partials/changePassword',
        controller: ChangePasswordCtrl
      }).
      when('/student', {
        templateUrl: 'partials/student',
        controller: StudentCtrl
      }).
      when('/teacher', {
        templateUrl: 'partials/teacher',
        controller: TeacherCtrl
      }).
      when('/ta', {
        templateUrl: 'partials/ta',
        controller: TaCtrl
      }).
      when('/administrator', {
        templateUrl: 'partials/administrator',
        controller: AdministratorCtrl
      }).
      when('/addUser', {
        templateUrl: 'partials/addUser',
        controller: AddUserCtrl
      }).
      when('/addHomework', {
        templateUrl: 'partials/addHomework',
        controller: AddHomeworkCtrl
      }).
      when('/editState/:id', {
        templateUrl: 'partials/editState',
        controller: EditStateCtrl
      }).
      when('/scorePrivilege/:id', {
        templateUrl: 'partials/scorePrivilege',
        controller: ScorePrivilegeCtrl
      }).
      when('/review/:id', {
        templateUrl: 'partials/review',
        controller: ReviewCtrl
      }).
      when('/reviewother/:id', {
        templateUrl: 'partials/reviewother',
        controller: ReviewotherCtrl
      }).
      when('/showStudentHomework/:id', {
        templateUrl: 'partials/showStudentHomework',
        controller: ShowStudentHomeworkCtrl
      }).
      when('/upload/:id', {
        templateUrl: 'partials/upload',
        controller: UploadCtrl
      }).
      when('/download/:id', {
        templateUrl: 'partials/download',
        controller: DownloadCtrl
      }).
      otherwise({
        redirectTo: '/'  // 其他情况，跳到链接"/"
      });
    $locationProvider.html5Mode(true);
  }]);