/**
 * Created by WG003 on 2018/8/30.
 */
angular.module('starter.WxBills', [])
  .factory('wxBills', function($http,$rootScope,$q,userService) {
    var param = {};
    //页码
    param.curPage = 0;
    param.hasmore = false;
    param.pageSize=10;

    return {
      getState0:function (type) {
        var q=$q.defer();
        var p = {
          userName: $rootScope.userName,
          type:type
        };
        $http.post(userService(0).address+"WeixiuService.asmx/AfterSRepair",p).success(function (response, status, headers, config) {
          q.resolve(response);
        }).error(function (response, status, headers, config) {
          q.reject(response);
        });
        return q.promise;
      },
      param:param
    };
  });


