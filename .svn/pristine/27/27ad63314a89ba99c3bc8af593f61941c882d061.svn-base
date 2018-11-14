/**
 * Created by WG003 on 2018/8/22.
 */
angular.module('starter.ywMsg', [])

  .factory('YWMesseges', function($http,$rootScope,$q,userService) {

    var paramA = {};
    //页码
    paramA.curPage = 0;
    paramA.hasmore = false;
    paramA.pageSize=7;
    var paramB = {};
    //页码
    paramB.curPage = 0;
    paramB.hasmore = false;
    paramB.pageSize=7;
    var paramC = {};
    //页码
    paramC.curPage = 0;
    paramC.hasmore = false;
    paramC.pageSize=7;

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
