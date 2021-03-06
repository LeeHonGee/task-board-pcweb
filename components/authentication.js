'use strict';

angular.module('myApp.authentication', [])
  .factory('authSrv', ['$http', '$q', '$window', '$rootScope', 'HOST', '$location', function ($http, $q, $window, $rootScope, host, $location) {
    return {
      signin: function (data) {
        var deferred = $q.defer();

        $http.post(host + "user/login2", data)
          .then(function (result) {
            var userInfo = result.data;

            $window.localStorage["userId"] = JSON.stringify(userInfo.id);
            $window.localStorage["sid"] = userInfo.sid;
            deferred.resolve(userInfo);
          }, function (error) {
            deferred.reject(error);
          });
        return deferred.promise;
      },
      isLogin: function () {
        return !!$window.localStorage["userId"]
      },
      showUserName: function () {
        var userId = $window.localStorage["userId"];

        // 查询用户列表
        $http.get(host + 'user/show/' + userId + '?sid=' + $window.localStorage['sid'])
          .success(function (user) {
            $rootScope.$broadcast('username.change', user.name);
          });
      },
      logout: function () {
        delete $window.localStorage["userId"];
        delete $window.localStorage["sid"];
        $location.path('/login');
      }
    };
  }
  ]);
