/**
 * Created by WG003 on 2018/8/22.
 */
angular.module('starter.ywMsg', [])

  .factory('YWMesseges', function($http,$rootScope,$q,userService) {

    return {
      state0: function(index,where) {
        var q=$q.defer();
        var p = {
          userName: $rootScope.userName,
          where:" and state ="+index+where,
        };
        $http.post(userService(0).address+"MessageService.asmx/YWBillGet",p).success(function (response, status, headers, config) {
          q.resolve(response);
        }).error(function (response, status, headers, config) {
          q.reject(response);
        });
        return q.promise;
      },
      get: function(code) {
        var p1={
          code:code
        };
        var q=$q.defer();
        $http.post(userService(0).address+"MessageService.asmx/YW_Detail_Bill",p1).success(function (response, status, headers, config) {
          q.resolve(response);
        }).error(function (response, status, headers, config) {
          q.reject(response);
        });
        return q.promise;
      }
    };
  });
