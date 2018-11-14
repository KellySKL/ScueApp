angular.module('starter.controllers', [])
// 新建客户
  .controller('KFCtrl', function(comlocation,$ionicLoading,$timeout,$rootScope,$http,$scope,$state,$stateParams,userService) {

//===============================新建客户  kf========================================
    $scope.kf_type='新建客户';
    $scope.kf_lev="1级  150天";
    $scope.kf_name="";
    $scope.setKFLocation=function () {
      if($scope.kf_name=="")
      {
        $ionicLoading.show({
          template: '请填写客户名称和基本信息!'
        });
        $timeout(function() {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      }
      else {
        $ionicLoading.show({
          template: '正在获取当前位置...'
        });
        comlocation.exec().then(function (success) {
          var p = {
            userName: $rootScope.userName,
            client: $scope.kf_name,
            type: $scope.kf_type,
            lev: $scope.kf_lev,
            lng: $rootScope.lng,
            lat: $rootScope.lat
          }
          //alert(angular.toJson(p));
          $http.post(userService(0).address + "LocationService.asmx/KFNew", p)
            .success(function (response, status, headers, config) {
              if (response.d == 0) {
                $ionicLoading.show({
                  template: '新建成功!'
                });
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 2000);
              }
              else if (response.d == -5) {
                $ionicLoading.show({
                  template: '身份验证失败，请重新登录!'
                });
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 2000);
              } else if (response.d == -1) {
                $ionicLoading.show({
                  template: '该客户已存在，若无定位请联系管理人员标记!'
                });
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 3000);
              } else {

              }
            })
            .error(function (response, status, headers, config) {
              $ionicLoading.show({
                template: '新建客户失败!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            });
        }, function (error) {
          $ionicLoading.show({
            template: '获取当前位置失败！'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        })
      }
    };
  })
// 申请报备
  .controller('ConferenceCtrl', function($rootScope,$timeout,$ionicLoading,$ionicPopup,$http,$scope,$state,$stateParams,userService) {

    $scope.data = {};
    $scope.choseBill=function () {
      var p={
        userName:$rootScope.userName
      }
      $http.post(userService(0).address + "AccountService.asmx/GetBills", p)
        .success(function (response, status, headers, config) {
          $scope.List=response.d;
          if($scope.List==null||$scope.List.length==0)
          {
            $ionicLoading.show({
              template: '没有查到当天拜访记录!'
            });
            $timeout(function() {
              $ionicLoading.hide(); // 2秒后关闭弹窗
            }, 2000);
          }
          else
          {
            $ionicPopup.show({
              title:"选择客户",
              template: "<ion-radio ng-repeat='item in List' ng-value='item'  ng-model='data.item'  ng-checked='item.checked'>{{ item.client}}</ion-radio>",
              scope: $scope,
              buttons: [
                { text: '取消' },
                {
                  text: '<b>确认</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    var bill = $scope.data.item;
                    $scope.searchName = bill.client;
                    $scope.hisname=bill.hisname;
                    $scope.hisposition=bill.hisposition;
                    $scope.hisphone=bill.hisphone;
                    $scope.content=bill.content;
                    $scope.code=bill.code;
                  }
                },
              ]
            });
          }
        })
        .error(function (response, status, headers, config) {
          alert('连接失效请重新登录！');
        });
    }

    $scope.submit=function () {
      $ionicLoading.show({
        template: '正在提交数据...'
      });
      if ($scope.code == null) {
        $ionicLoading.show({
          template: '请选择客户拜访单!'
        });
        $timeout(function () {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      }
      else {
        var p1 = {
          userName:$rootScope.userName,
          code: $scope.code,
          client:$scope.searchName,
          eating: document.getElementById('txt1').value,
          other: document.getElementById('txt2').value,
          person: document.getElementById('txt3').value,
          traffic: document.getElementById('txt4').value,
          commission: document.getElementById('txt5').value,
          remark:document.getElementById('txt6').value,
          hisname:$scope.hisname,
          hisphone:$scope.hisphone,
          note:$scope.content,
        };
        if(p1.eating==""&&p1.other==""&&p1.person==""||p1.eating!=""&&p1.other!=""&&p1.person!="")
        {
         // alert(angular.toJson(p1));
          $http.post(userService(0).address + "AccountService.asmx/AccountFee", p1)
            .success(function (response, status, headers, config) {
              $ionicLoading.show({
                template: '提交成功！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
                window.history.back();
              }, 2000);
            })
            .error(function (response, status, headers, config) {
              $ionicLoading.show({
                template: '提交失败！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
              //alert('连接失效请重新登录！');
            });
        }
        else
        {
          $ionicLoading.show({
            template: '招待费的内容填写不全！'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
      }
    }
  })
// 菜单页
  .controller('TabsCtrl', function($interval,$rootScope,$http,$scope,$state,$stateParams,userService) {

    $scope.data = {
      nowUser: localStorage.getItem("userName"),
      myVar: true
    };

    $scope.log_out=function () {
      // $interval.cancel($rootScope.timer);  2018 -8-22 skl  注释
      $state.go('login');
    }
  })
// 拜访历史
  .controller('YW_2_Ctrl', function($ionicLoading,$ionicListDelegate,bfBills,$rootScope,$ionicPopup,$timeout,$http,$scope,$state,$stateParams,userService) {
    $scope.data = [];
    bfBills.param.hasmore=true;
    //上拉刷新
    $ionicLoading.show({
      template: '正在加载数据...'
    });

    $scope.doRefresh = function() {
      bfBills.param.curPage=0;
      $scope.data = [];//每次重新清空
      bfBills.getList().then(function(response){
        $scope.data = response.d;
        bfBills.param.hasmore = response.d.length==bfBills.param.pageSize;
        bfBills.param.curPage++;
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    //更多
    $scope.loadMore = function() {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $timeout(function() {
        if(!bfBills.param.hasmore){
          var timer= $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
          $timeout.cancel(timer);
          $ionicLoading.hide(); // 2秒后关闭弹窗
          //$scope.$broadcast('scroll.infiniteScrollComplete');
          return;
        }
        bfBills.getList().then(function(response){
          bfBills.param.hasmore = response.d.length==bfBills.param.pageSize;
          for(var i=0;i<response.d.length;i++){
            $scope.data.push(response.d[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          bfBills.param.curPage++;
          $ionicLoading.hide(); // 2秒后关闭弹窗
        });
      },1000);
    };
    $scope.moreDataCanBeLoaded = function(){
      return bfBills.param.hasmore;
    }

    $scope.$on("$destroy", function () {
      //清除配置,不然scroll会重复请求,每次进来都是新页面
      bfBills.param.hasmore=true;
      bfBills.param.curPage=0;
    });

    $ionicListDelegate.showReorder(true);

      // $scope.doRefresh = function() {
      //   $http.post(userService(0).address+"YewuService.asmx/HisVisit",p).success(function (response, status, headers, config) {
      //     $scope.data =response.d;
      //   }).error(function (response, status, headers, config) {
      //     var alertPopup = $ionicPopup.alert({
      //       title: '提示',
      //       template: '请检查网络是否连接！'
      //     });
      //     $timeout(function() {
      //       alertPopup.close(); // 2秒后关闭弹窗
      //     }, 2000);
      //   }).finally(function() {
      //       // 停止广播ion-refresher
      //       $scope.$broadcast('scroll.refreshComplete');
      //   });
      // };
      // var p={
      //   userName: $rootScope.userName
      // }
      // $http.post(userService(0).address+"YewuService.asmx/HisVisit",p).success(function (response, status, headers, config) {
      //   $scope.data =response.d;
      // }).error(function (response, status, headers, config) {
      //   var alertPopup = $ionicPopup.alert({
      //     title: '提示',
      //     template: '请检查网络是否连接！'
      //   });
      //   $timeout(function() {
      //     alertPopup.close(); // 2秒后关闭弹窗
      //   }, 2000);
      // });

      $scope.edit=function (item) {
        // 一个精心制作的自定义弹窗
        $scope.content=item.content;
        var myPopup = $ionicPopup.show({
          template: '<textarea style="height: 150px" ng-model="$parent.content"> </textarea>',
          title: '编辑内容',
          // subTitle: 'Please use normal things',
          scope: $scope,
          buttons: [
            { text: '取消' },
            {
              text: '<b>保存</b>',
              type: 'button-positive',
              onTap: function(e) {
                var p={
                  code:item.code,
                  content:$scope.content
                };
                $http.post(userService(0).address+"YewuService.asmx/EditVisit",p).success(function (response, status, headers, config) {
                  var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '保存成功！'
                  });
                  //保存成功刷新数据
                  item.content=$scope.content;

                  $timeout(function() {
                    alertPopup.close(); // 2秒后关闭弹窗
                  }, 2000);
                }).error(function (response, status, headers, config) {
                  var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: '请检查网络是否连接！'
                  });
                  $timeout(function() {
                    alertPopup.close(); // 2秒后关闭弹窗
                  }, 2000);
                });
              }
            },
          ]
        });
        myPopup.then(function(res) {
          console.log('Tapped!', res);
        });
      }

      $scope.goBack =function () {
      $state.go('tab.dash');
    };
  })
// 我的报备
  .controller('FeeCtrl', function($ionicLoading,$ionicListDelegate,feeBills,$timeout,$ionicPopup,$http,$rootScope,$scope,$state,$stateParams,userService) {
    $scope.data = [];
    feeBills.param.hasmore=true;
    $ionicLoading.show({
      template: '正在加载数据...'
    });
    //上拉刷新
    $scope.doRefresh = function() {
      feeBills.param.curPage=0;
      $scope.data = [];//每次重新清空
      feeBills.getList().then(function(response){
        $scope.data = response.d;
        feeBills.param.hasmore = response.d.length==feeBills.param.pageSize;
        feeBills.param.curPage++;
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    //更多

    $scope.loadMore = function() {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $timeout(function() {
        if(!feeBills.param.hasmore){
          var timer= $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
          $timeout.cancel(timer);
          $ionicLoading.hide(); // 2秒后关闭弹窗
          //$scope.$broadcast('scroll.infiniteScrollComplete');
          return;
        }
        feeBills.getList().then(function(response){
          feeBills.param.hasmore = response.d.length==feeBills.param.pageSize;
          for(var i=0;i<response.d.length;i++){
            $scope.data.push(response.d[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          feeBills.param.curPage++;
          $ionicLoading.hide(); // 2秒后关闭弹窗
        });
      },1000);
    };
    $scope.moreDataCanBeLoaded = function(){
      return feeBills.param.hasmore;
    }

    $scope.$on("$destroy", function () {
      //清除配置,不然scroll会重复请求,每次进来都是新页面
      feeBills.param.hasmore=true;
      feeBills.param.curPage=0;
    });

    $ionicListDelegate.showReorder(true);

    $scope.getDet=function (item) {
      $state.go('tab.fee-detail',{item:item});
    }
    // var p = {
    //   userName: $rootScope.userName,
    // };
    //
    // $http.post(userService(0).address+"AccountService.asmx/FeeBills",p).success(function (response, status, headers, config) {
    //   $scope.data = response.d;
    // }).error(function (response, status, headers, config) {
    //   // alert(angular.toJson(response));
    // });
    // $scope.doRefreshFee = function() {
    //   var p = {
    //     userName: $rootScope.userName,
    //   };
    //   $http.post(userService(0).address + "AccountService.asmx/FeeBills", p).success(function (response, status, headers, config) {
    //     $scope.data = response.d;
    //   }).error(function (response, status, headers, config) {
    //     var alertPopup = $ionicPopup.alert({
    //       title: '提示',
    //       template: '请检查网络是否连接！'
    //     });
    //     $timeout(function () {
    //       alertPopup.close(); // 2秒后关闭弹窗
    //     }, 2000);
    //   }).finally(function () {
    //     // 停止广播ion-refresher
    //     $scope.$broadcast('scroll.refreshComplete');
    //   });
    // }
    //
  })
// 报备内容
  .controller('FeeDetailCtrl', function(auditBills,$timeout,$ionicLoading,$ionicPopup,$http,$rootScope,$scope,$state,$stateParams,userService) {
    $scope.item=$stateParams.item;
    if($stateParams.myVar!=null)
    {
      $scope.myVar=$stateParams.myVar;
    }
    else
    {
      $scope.myVar=true;//隐藏
    }
    $scope.audit=function (type) {
      if(type=="NO" && document.getElementById('txt7').value=="")
      {
        $ionicLoading.show({
          template: '请填写否决原因!'
        });
        $timeout(function() {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      }
      else {
        var p = {
          userName: $rootScope.userName,
          billcode: $scope.item.billcode,
          opinion: document.getElementById('txt7').value,
          type: type
        }
        $http.post(userService(0).address + "AccountService.asmx/AuditBills", p).success(function (response, status, headers, config) {
          if (response.d) {
            $ionicLoading.show({
              template: '审核成功!'
            });
            auditBills.param.hasmore=true;
            auditBills.param.curPage=0;
            $timeout(function () {
              $ionicLoading.hide(); // 2秒后关闭弹窗
              history.back(-1);
              //$state.go('feeaudit',{},{reload:true,location:'replace'});
            }, 2000);
          }
          else {
            $ionicLoading.show({
              template: '审核失败!'
            });
            $timeout(function () {
              $ionicLoading.hide(); // 2秒后关闭弹窗
            }, 2000);
          }
        }).error(function (response, status, headers, config) {
          $ionicLoading.show({
            template: '网络连接出错!'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        });
      }

    }

    // $scope.back=function () {
    //   $state.go('tab.fee-audit',{},{reload:true,location:'replace'});
    // }
  })
// 审核报备
  .controller('AuditCtrl', function($ionicListDelegate,auditBills,$ionicLoading,$timeout,$ionicPopup,$http,$rootScope,$scope,$state,$stateParams,userService) {
    $scope.data = [];
    auditBills.param.hasmore=true;
    //上拉刷新
    $ionicLoading.show({
      template: '正在加载数据...'
    });

    $scope.doRefresh = function() {
      auditBills.param.curPage=0;
      $scope.data = [];//每次重新清空
      auditBills.getList().then(function(response){
        $scope.data = response.d;
        auditBills.param.hasmore = response.d.length==auditBills.param.pageSize;
        auditBills.param.curPage++;
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    //更多
    $scope.loadMore = function() {
      //这里使用定时器是为了缓存一下加载过程，防止加载过快
      $timeout(function() {
        if(!auditBills.param.hasmore){
          var timer= $timeout(function () {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
          $timeout.cancel(timer);
          $ionicLoading.hide(); // 2秒后关闭弹窗
          //$scope.$broadcast('scroll.infiniteScrollComplete');
          return;
        }
        auditBills.getList().then(function(response){
          auditBills.param.hasmore = response.d.length==auditBills.param.pageSize;
          for(var i=0;i<response.d.length;i++){
            $scope.data.push(response.d[i]);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
          auditBills.param.curPage++;
          $ionicLoading.hide(); // 2秒后关闭弹窗
        });
      },1000);
    };
    $scope.moreDataCanBeLoaded = function(){
      return auditBills.param.hasmore;
    }

    $scope.$on("$destroy", function () {
      //清除配置,不然scroll会重复请求,每次进来都是新页面
      auditBills.param.hasmore=true;
      auditBills.param.curPage=0;
    });

    $ionicListDelegate.showReorder(true);

    $scope.goBack = function(){
      // var  url = historyUrlService.getBackUrl();
      // if(url == ""){
      //   historyUrlService.goUrlByState("index");
      // }else{
      //   historyUrlService.goUrlBuyUrl(url);
      // }
      $state.go('tab.dash');
    };

    // var p = {
    //   userName: $rootScope.userName
    // };
    // $http.post(userService(0).address+"AccountService.asmx/BillsState0",p).success(function (response, status, headers, config) {
    //   $scope.data = response.d;
    // }).error(function (response, status, headers, config) {
    //   // alert(angular.toJson(response));
    // });
    // $scope.doRefreshAudit = function() {
    //   $http.post(userService(0).address + "AccountService.asmx/BillsState0", p).success(function (response, status, headers, config) {
    //     $scope.data = response.d;
    //   }).error(function (response, status, headers, config) {
    //     var alertPopup = $ionicPopup.alert({
    //       title: '提示',
    //       template: '请检查网络是否连接！'
    //     });
    //     $timeout(function () {
    //       alertPopup.close(); // 2秒后关闭弹窗
    //     }, 2000);
    //   }).finally(function () {
    //     // 停止广播ion-refresher
    //     $scope.$broadcast('scroll.refreshComplete');
    //   });
    // }

    $scope.getDet=function (item) {
      //$state.go('tab.fee-detail',{item:item,myVar:false});
      $state.go('feeDetail',{item:item,myVar:false});
    }

  })
// 提交成功
  .controller('SubCtrl', function($rootScope,$scope,$state,$stateParams,userService) {
    //userService(0).userName
     $scope.back =function () {
      $state.go('tab.dash');
    }
  })
// 主页
.controller('DashCtrl', function($interval,platformService,$ionicLoading,$ionicPopup,aMapServ,comlocation,$rootScope,$scope,$state,$stateParams,userService,$timeout,$http) {

  $scope.scheduleSingleNotification = function () {
    cordova.plugins.notification.local.schedule({
      id: 1,
      title: '应用提醒',
      text : '应用有新消息,快来查看吧',
      at: new Date(),
      // every: 'minute'
    });
  };

  //==============================客户搜索 start=======================================
  $('body').click(function(e) {
    $('#kflist').hide();
  });
  $("#kflist").hide();
  $scope.searchName;
  $scope.searchCN=function(){
    var p = {
      userId: userService(0).userInfo,
      searchName:$scope.searchName
    };
    if(p.searchName.length>0)
    {
      if(parseFloat($scope.searchName).toString() != "NaN")
      {
        if(p.searchName.length>=3)
        {
          $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
            .success(function (response, status, headers, config) {
              $scope.dataKF=response.d;
              $("#kflist").show();
            })
            .error(function (response, status, headers, config) {
              alert(angular.toJson(response));
            });
        }
      }
      else
      {
        $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
          .success(function (response, status, headers, config) {
            $scope.dataKF=response.d;
            $("#kflist").show();
          })
          .error(function (response, status, headers, config) {
            alert(angular.toJson(response));
          });
      }
    }
    else
    {
      $scope.dataKF=null;
      $("#kflist").hide();
    }
  };
  $scope.it_click=function (item) {
    $scope.searchName = item.NAME;
    // client_id=item.ID;
    $("#kflist").hide();
  };
//==============================客户搜索=end======================================

  //============================地图start================================
  var AMapArea = document.getElementById('amap');
  var list_lineArr = new Array();//创建数组，存取
  AMapArea.parentNode.style.height = "100%";
  $scope.AMapId = 'container';
  $scope.geolocation;//存放地理位置对象
  $scope.lngX=0000;
  $scope.latY=0000;
  /**
   * 是否记录路径
   */
  $scope.initAMap = function () {
    if(userService(0).if_map)//需定位人员
    {
      if($scope.mapObj==null)
      {
        $scope.mapObj = aMapServ.all();
      }
      AMap.plugin('AMap.Geolocation', function () {
        if($scope.geolocation==null)
        {
          $scope.geolocation = aMapServ.geo();
          $scope.mapObj.addControl($scope.geolocation);
        }
        // list_lineArr.push(new AMap.LngLat($scope.lngX, $scope.latY)); // 放置第一个点
        $scope.geolocation.getCurrentPosition();//进入后直接调用
        $scope.geolocation.watchPosition();//监控当前位置
        AMap.event.addListener($scope.geolocation, 'complete', onComplete); // 返回定位信息
        AMap.event.addListener($scope.geolocation, 'error', onError);       // 返回定位出错信息
      });

    }
  };

  //解析定位结果
  function onComplete (data) {
    var str = '<div>定位成功</div>';
    str += '<div>经度：' + data.position.getLng() + '</div>';
    str += '<div>纬度：' + data.position.getLat() + '</div>';
    // str += '<div>精度：' + data.accuracy + ' 米</div>';
    str += '<div>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</div>';
    // str += '<div>地址信息：' + JSON.stringify(data.addressComponent, null, 4)+ '</div>';
    result.innerHTML = str;
    // $scope.lngX = data.position.getLng();//经度
    // $scope.latY = data.position.getLat();//纬度
    //alert($scope.lngX +":"+$scope.latY);
    // drawLine();
  };
  //解析定位错误信息
  function onError (data) {
    var str = '<p>定位失败</p>';
    str += '<p>错误信息：'
    switch(data.info) {
      case 'PERMISSION_DENIED':
        str += '浏览器阻止了定位操作';
        break;
      case 'POSITION_UNAVAILBLE':
        str += '无法获得当前位置';
        break;
      case 'TIMEOUT':
        str += '定位超时';
        break;
      default:
        str += '未知错误';
        break;
    }
    str += '</p>';
    result.innerHTML = str;
  };

  function  drawLine() {
    polyline = new AMap.Polyline({
      path: list_lineArr, //设置线覆盖物路径
      strokeColor: "#3366FF", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 5, //线宽
      strokeStyle: "solid", //线样式
      strokeDasharray: [10, 5] //补充线样式
    });
    polyline.setMap($scope.mapObj);
  }
  /**
   * 在标记点画圆
   */
  $scope.addCircle = function () {
    //初始化待编辑的圆实例
    var circle = new AMap.Circle({
      map: $scope.mapObj,
      center: new AMap.LngLat("116.397428", "39.90923"),
      radius: 1000,
      strokeColor: '#F33',
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: '#ee2200',
      fillOpacity: 0.35
    });
    //加载圆编辑插件
    var circleEditor;
    $scope.mapObj.plugin(["AMap.CircleEditor"], function () {
      //实例化时指定地图对象
      circleEditor = new AMap.CircleEditor($scope.mapObj, circle);
    });
  };

// 实例化点标记
  function addMarker(lnglatXY) {

    marker = new AMap.Marker({
      icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: lnglatXY
    });
    marker.setMap(map);
    map.setFitView();// 执行定位
  }
  /**
   * 点击地图增加锚点
   */
  $scope.ListenClick=function(){
    AMap.event.addListener($scope.mapObj,'click',function(e){
      var lnglat=e.lnglat;
      marker=new AMap.Marker({
        map:$scope.mapObj,
        position:e.lnglat,
        icon:"http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        offset:new AMap.Pixel(-10,-34)
        // content:m
      });
      $scope.mapObj.setCenter(lnglat);
    });
  };
  //获取当前位置信息
  $scope.getCurrentPosition=function() {
    $scope.geolocation.getCurrentPosition();
  };
  //监控当前位置并获取当前位置信息
  $scope.watchPosition=function() {
    $scope.geolocation.watchPosition();
  };
  //===============================地图end==================================


//===============================周围客户 start=======================================
  var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30),
    size:new AMap.Size(230,0)
  });     //创建信息窗口对象  ps.高德目前不支持多信息窗口，即使创建多个窗口对象，也只会显示一个 10/26/2016
  var addMarkers=[];
  var kflist;
  function clear() {
    $scope.mapObj.remove(addMarkers);
    addMarkers = [];
    infoWindow.close();
    $scope.mapObj.clearMap();
  }

  $scope.getMap = function (chose) {
    $scope.initAMap();
    $ionicLoading.show({
      template: '正在获取当前位置...'
    });
    comlocation.exec().then(function (success) {
        var p ={
          userName: $rootScope.userName,
          type:chose,
          lng:$rootScope.lng,
          lat:$rootScope.lat
        };
        $http.post(userService(0).address + "LocationService.asmx/Neighbour", p)
          .success(function (response, status, headers, config) {
            kflist=response.d;
            clear();//清除原来的信息
            for (var i = 0; i < kflist.length; i++) {
              var POI = new AMap.LngLat(kflist[i].lng, kflist[i].lat);
              addKFmarker(POI, kflist[i]);
            }
            $ionicLoading.hide();
          })
          .error(function (response, status, headers, config) {
            $ionicLoading.show({
              template: '检查网络是否连接!'
            });
            $timeout(function () {
              $ionicLoading.hide(); // 2秒后关闭弹窗
            }, 2000);
          });
      },function (error) {
          $ionicLoading.show({
            template: '获取当前位置失败!'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
      }
    );
  }
//客户标记
  function  addKFmarker(poi,obj) {
    marker=new AMap.Marker({
      position:poi,        //采用默认样式，无需自定义
      map:$scope.mapObj,
      offset: new AMap.Pixel(-10, -34),
      // icon: new AMap.Icon({
      //   // size: new AMap.Size(40, 50),
      //   cour:1,
      //   image: "img/marker_red.png"     //自定义的标记图片样式(图片需自己准备)
      // })
    });
    content=[];
    content.push('['+obj.type+']');
    content.push('公司名称：'+obj.name);
    content.push('上次回访时间：'+obj.lastVisit);
    marker.content = content;
    marker.extData = {'name':obj.name,'data':obj}
    marker.on('click', u_markerClick);
    addMarkers.push(marker);
  }

  //信息窗口
  function u_markerClick(e){
    document.getElementById("gothereN").value=e.target.extData.name;
    //$scope.searchName=e.target.extData.name;
    infoWindow.setContent(e.target.content.join('<br/>'));
    infoWindow.open($scope.mapObj, e.target.getPosition());
  }
  //===============================周围客户 end=======================================

//==================================导航start=======================================
  var kfarr;
  $scope.applist;
  var findMap = new Array();
  function app(plat,name,url){
    this.plat=plat;
    this.name=name;
    this.url=url;
  }
  var schemeIntent;
  var scheme;
  $scope.GoThere=function (kfname) {
    var p = {
      client: document.getElementById("gothereN").value,
    };
    $scope.searchName=document.getElementById("gothereN").value;
    if (p.client == "") {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: '请先输入客户！'
      });
      $timeout(function() {
        alertPopup.close(); // 2秒后关闭弹窗
      }, 2000);
    }
    else {
      $http.post(userService(0).address + "YewuService.asmx/GetKFLoc", p)
        .success(function (response, status, headers, config) {
          if(response.d=="NoCookies")
          { }
          else if(response.d=="")
          {
            var alertPopup = $ionicPopup.alert({
              title: '提示',
              template: '该客户未标记地址！'
            });
            $timeout(function() {
              alertPopup.close(); // 2秒后关闭弹窗
            }, 2000);
          }
          else if(response.d=="none")
          {
            var alertPopup = $ionicPopup.alert({
              title: '提示',
              template: '不存在该用户！'
            });
            $timeout(function() {
              alertPopup.close(); // 2秒后关闭弹窗
            }, 2000);

          }
          else
          {
            kfarr = response.d.split(",");
            var platform='';
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
            var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            if(isAndroid==true)
            {
              platform="Android";
              schemeIntent = 'com.autonavi.minimap';//高德
              scheme= 'com.baidu.BaiduMap';//百度
            }
            else if(isiOS==true)
            {
              platform="IOS";
              schemeIntent = "iosamap://"//高德
              scheme = 'baidu://';//百度
            }
            else
            {
              platform="Web";
            }
            findMap.splice(0,findMap.length);
            findMap.push(new app(platform,"高德地图",schemeIntent));
            findMap.push(new app(platform,"百度地图",scheme));
            $scope.applist = findMap;
            //lat,lng,kflat,kflng,name
            if($scope.applist.length>0)
            {
             // $scope.applist = $rootScope.findMap;
              choseApp();
            }
            else
            {
              var pop =  $ionicPopup.show({
                title:"提示",
                template: "请先下载百度地图或者高德地图！",
                buttons: [
                  { text: '取消' }
                ]
              });
              $timeout(function() {
                pop.close(); // 2秒后关闭弹窗
              }, 2000);
            }
          }
        })
        .error(function (response, status, headers, config) {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '请检查您的网络是否已连接！'
          });
          $timeout(function() {
            alertPopup.close(); // 2秒后关闭弹窗
          }, 2000);
        });
    }
  }

  //选择地图
  function choseApp () {
    var pop =  $ionicPopup.show({
      title:"选择地图",
      template: "<ion-item ng-repeat='item in applist' ng-click='selectApp(item)'>{{ item.name }} </ion-item>",
      scope: $scope,
      buttons: [
        { text: '取消' }
      ]
    });
    $timeout(function() {
      pop.close(); // 2秒后关闭弹窗
    }, 2000);
  }
  $scope.selectApp=  function (app) {
    gotomap.geo1(app,0,0,kfarr[1],kfarr[0],$scope.searchName);
  }
  //==================================导航end=======================================

})
// 客户拜访
  .controller('YW_1_Ctrl', function(ionicDatePicker,comlocation,$rootScope,$scope,$state,$stateParams,userService,Houses,$http,$location,$filter,$ionicPopup,$ionicLoading,$timeout) {
    //$scope.item=$stateParams.item;
    if($stateParams.item!=null)
    {
      $scope.searchName=$stateParams.item.client;
      $scope.bfid=$stateParams.item.id;//拜访任务单id
      $scope.hisName=$stateParams.item.name,
      $scope.hisPosition=$stateParams.item.position,
      $scope.hisPhone=$stateParams.item.phone,
      document.getElementById("kfname").disabled=true;
    }
    else
    {
      $scope.bfid=-1;
      document.getElementById("kfname").disabled=false;
    }
    $scope.next_visitMethod='上门拜访';
    $scope.visitMethod='上门拜访';
    $scope.visitType='正常回访';
   // $scope.IfWX='无需求';
    $scope.visitTime = $filter("date")(new Date(), "yyyy-MM-dd");
    $('body').click(function(e) {
      $('#listkf').hide();
    });
    $("#listkf").hide();
    var p = {
      userId: userService(0).userInfo
    };
    /**
     * 加载innerHTML
     */
    // $http.post(userService(0).address+"FormService.asmx/WeixiuForm",p).success(function (response, status, headers, config) {
    //   var str = response.d;
    //   str = '<form>'+str;
    //   str  = str + '</form>';
    //   ts_css.innerHTML = str;
    // }).error(function (response, status, headers, config) {
    //   alert(response);
    // });
   // var client_id;
    $scope.validedTime = "默认";
    // $filter("date")(new Date(), "yyyy-MM-dd")
    var datePickerObj = {
      //选择日期后的回调
      callback: function (val) {
        if (typeof (val) === 'undefined') {
        } else {
          $scope.validedTime = $filter('date')(new Date(val), 'yyyy-MM-dd');
          datePickerObj.inputDate = new Date(val); //更新日期弹框上的日期
        }
      },
      disabledDates: [
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("2016-08-16"),
        new Date(1439676000000)
      ],
      from: new Date(),
      to: new Date(2099, 1, 1),
      inputDate: new Date(),
      mondayFirst: false,
      disableWeekdays: [0], //设置不能选中
      closeOnSelect: false,
      dateFormat: 'yyyy-MM-dd',
      templateType: 'popup',
    };

    //打开日期选择框
    $scope.openDatePicker = function () {
      ionicDatePicker.openDatePicker(datePickerObj);
    };

    document.getElementById("salecontent").value="";
    $scope.submit =function () {
      $ionicLoading.show({
        template: '正在提交数据...'
      });
      comlocation.exec().then(function (success) {
          var VisObj = {
            bfid:$scope.bfid,
            userId:$rootScope.userinfo,
            client: $scope.searchName,
            zf2: $scope.visitMethod,
            billtype: $scope.visitType,
            date: $scope.visitTime,
            hisname: $scope.hisName,
            hisposition: $scope.hisPosition,
            hisphone: $scope.hisPhone,
            content: $scope.content,
            userName: $rootScope.userName,
            lng1: success.x,//用户当前位置
            lat1: success.y,
            nextTime:$scope.validedTime,
            nextMethod:$scope.next_visitMethod,
            nextNotice:$scope.next_notice,
            IfWX:$scope.IfWX,
            saleContent:document.getElementById("salecontent").value
          };
          $http.post(userService(0).address + "YewuService.asmx/NewVisit", VisObj).success(function (response, status, headers, config) {
            if (response.d == 5) {
              $ionicLoading.show({
                template: '不在客户附近，不能提交！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            }
            else if (response.d == -1) {
              $ionicLoading.show({
                template: '客户暂无定位！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            }
            else if (response.d == -2) {
              $ionicLoading.show({
                template: '不存在该用户,请先新建客户！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            }
            else if (response.d == 0) {
              $ionicLoading.show({
                template: '提交成功！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
                $state.go('tab.dash');
              }, 2000);
            }
            else {
              //alert(angular.toJson(response));
            }
          }).error(function (response, status, headers, config) {
            $ionicLoading.show({
              template: '提交失败，请检查数据是否填写完整,网络是否已连接！'
            });
            $timeout(function () {
              $ionicLoading.hide(); // 2秒后关闭弹窗
            }, 2000);
          });
        }
        , function (error) {
          $ionicLoading.show({
            template: '获取当前位置失败!'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
          //alert('获取当前位置失败：' + angular.toJson(error));
        });
    }
    //选择联系人
    $scope.choose=function () {
      if($scope.searchName==null||$scope.searchName=='')
      {
        $ionicLoading.show({
          template: '请先输入客户！'
        });
        $timeout(function () {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      }
      else {
        $state.go('contact', {
          res: {
            client: $scope.searchName,
            id: $scope.bfid
          }
        })
      }
    }
    $scope.searchCN=function(){
      var p = {
        userId: userService(0).userInfo,
        searchName:$scope.searchName
      };
      if(p.searchName.length>0)
      {
        // alert(document.getElementById("list").style.display)
        // document.getElementById("list").style.display=" ";//隐藏-->
        if(parseFloat($scope.searchName).toString() != "NaN")
        {
          if(p.searchName.length>=3)
          {
            $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
              .success(function (response, status, headers, config) {
                $scope.data=response.d;
                $("#listkf").show();
              })
              .error(function (response, status, headers, config) {
                alert(angular.toJson(response));
              });
          }
        }
        else
        {
          $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
            .success(function (response, status, headers, config) {
              $scope.data=response.d;
                $("#listkf").show();
            })
            .error(function (response, status, headers, config) {
              alert('连接失效请重新登录！');
            });
        }
      }
      else
      {
        $scope.data=null;
        $("#listkf").hide();
      }
    };
    $scope.it_click=function (item) {
      $scope.searchName = item.NAME;
     // client_id=item.ID;
      $("#listkf").hide();
    };
    $scope.goBack = function(){
      $state.go('tab.dash');
    };
  })
  // 联系人
  .controller('Contact_Ctrl', function($ionicPopup,$ionicLoading,$timeout,bfBills,$interval,$rootScope,$http,$scope,$state,$stateParams,$http,userService) {
    $scope.kfcode;
    $scope.tablename;
    if($stateParams.res!=null)
    {
      // alert(angular.toJson($stateParams.res));
      $scope.client=$stateParams.res.client;
      $scope.id=$stateParams.res.id;//拜访任务单id
    }
    bfBills.getContact($scope.client).then(function(response){
      // alert(angular.toJson(response.d));
      $scope.Person=response.d.list;
      $scope.kfcode=response.d.kfcode;
      $scope.tablename=response.d.tablename;
    },function () {

    });
    $scope.getDet=function (item) {
      item.id=$scope.id;
      item.client=$scope.client;
      // alert(angular.toJson(item));
      $state.go('yewu1', {item: item},{location:'replace'});
    }
    $scope.NewContact=function (sub) {
      var myPopup = $ionicPopup.show({
        template: ' <div class="item item-input">'+
        '姓名： <input type="text" ng-model="$parent.hisName">'+
        '</div>'+
        '<div class="item item-input">'+
        '职位： <input type="text" ng-model="$parent.hisPosition">'+
        '</div>'+
        '<div class="item item-input">'+
        '联系方式： <input type="text" ng-model="$parent.hisPhone">'+
        '</div>',
        title: '编辑内容',
        subTitle: sub,
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>保存</b>',
            type: 'button-positive',
            onTap: function(e) {
              var p={
                kfcode:$scope.kfcode,
                tablename:$scope.tablename,
                name:$scope.hisName,
                position:$scope.hisPosition,
                phone:$scope.hisPhone,
              };
              if (!p.name||!p.position||!p.phone) {
                //不允许用户关闭，除非他键入wifi密码
                e.preventDefault();
              } else {
                $ionicLoading.show({
                  template: '正在操作...'
                });
                $http.post(userService(0).address+"YewuService.asmx/NewContact",p).success(function (response, status, headers, config) {
                  if(response.d)
                  {
                    var contact = {
                      name:p.name,
                      position:p.position,
                      phone:p.phone,
                    }
                    $ionicLoading.hide(); // 2秒后关闭弹窗
                    $scope.Person.push(contact);
                  }
                  else
                  {
                    $ionicLoading.show({
                      template: '新建失败！'
                    });
                    $timeout(function () {
                      $ionicLoading.hide(); // 2秒后关闭弹窗
                    }, 2000);
                  }
                  myPopup.close();
                }).error(function (error) {
                  $ionicLoading.show({
                    template: '网络连接失败！'
                  });
                  $timeout(function () {
                    $ionicLoading.hide(); // 2秒后关闭弹窗
                  }, 2000);
                  //NewContact('请检查网络是否连接!');
                });
              }
            }
          },
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
    }
  })

  .controller('WX_1_Ctrl', function($rootScope,$scope,$state,$stateParams,userService,Houses,$http) {
    var p = {
      userId: userService(0).userInfo
    };
    // $http.post(userService(0).address+"FormService.asmx/WeixiuForm",p).success(function (response, status, headers, config) {
    //   var str = response.d;
    //   str = '<form>'+str;
    //   str  = str + '</form>';
    //   ts_css.innerHTML = str;
    // }).error(function (response, status, headers, config) {
    //   alert(response);
    // });

    /**
     * 回退到上一个页面
     */
    $scope.goBack = function(){
      // var  url = historyUrlService.getBackUrl();
      // if(url == ""){
      //   historyUrlService.goUrlByState("index");
      // }else{
      //   historyUrlService.goUrlBuyUrl(url);
      // }
      window.history.back();
    };

  })
// 维修总结
  .controller('WX_2_Ctrl', function(comlocation,$rootScope,$ionicLoading,$timeout,$scope,$state,$stateParams,userService,Houses,$http) {
    if($stateParams.item!=null)
    {
      $scope.item = $stateParams.item;
    }
    $scope.userName=$rootScope.userName;
    $scope.submit = function(){
      $ionicLoading.show({template: '正在获取位置...'});
      if($scope.item==null)
      {
        $ionicLoading.show({
          template: '请关联维修派单!'
        });
        $timeout(function() {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      }else {
        comlocation.exec().then(function () {
          var Obj = {
            userName: $rootScope.userName,
            userId: $rootScope.userinfo,
            client: $scope.item.CLIENT,
            billcode: $scope.item.CODE,
            id: $scope.item.ID,
            note: $scope.result,
            lng1: $rootScope.lng,
            lat1: $rootScope.lat
          }
          $http.post(userService(0).address + "WeixiuService.asmx/WxReport", Obj).success(function (response, status, headers, config) {
            if (response.d == -10) {
              $ionicLoading.show({
                template: '身份验证失败!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            } else if (response.d == -1) {
              $ionicLoading.show({
                template: '更新数据失败，请联系管理员!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            }
            else if (response.d == 0) {
              $ionicLoading.show({
                template: '提交成功!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
                $state.go('tab.dash');
              }, 2000);
            }
            else if (response.d == -2) {
              $ionicLoading.show({
                template: '客户无定位，提交失败!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            } else if (response.d == -3) {
              $ionicLoading.show({
                template: '不存在该用户，提交失败!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            } else if (response.d == 5) {
              $ionicLoading.show({
                template: '超出范围，提交失败!'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 2000);
            }
            else {

            }
          }).error(function (response, status, headers, config) {
            $ionicLoading.show({
              template: '请检查是否填写完整，网络请求失败!'
            });
            $timeout(function () {
              $ionicLoading.hide(); // 2秒后关闭弹窗
            }, 2000);
          });
        }, function (error) {
          $ionicLoading.show({template: '获取位置失败！'});
          $timeout(function () {
            $ionicLoading.hide();
          }, 2000);
        });
      }
      // if($scope.ifneed=="是"&&document.getElementById('remark').value=='')
      // {
      //   $ionicLoading.show({
      //     template: '请在备注中填写协助原因!'
      //   });
      //   $timeout(function() {
      //     $ionicLoading.hide(); // 2秒后关闭弹窗
      //   }, 2000);
      // }
      // else
      // {

      // }
    };

    /**
     * 回退到上一个页面
     */
    $scope.goBack = function(){
      // var  url = historyUrlService.getBackUrl();
      // if(url == ""){
      //   historyUrlService.goUrlByState("index");
      // }else{
      //   historyUrlService.goUrlBuyUrl(url);
      // }
      $state.go('tab.dash')
     // window.history.back();
    };

  })

  .controller('TestCtrl', function($rootScope,$scope,$state,$stateParams,userService,Houses,$http) {
    // var now_user = $stateParams.userId;
    // var str = angular.toJson($stateParams);
    // alert(str);
    // var get_data = userService(0);
    var p = {
      userId: userService(0).userInfo
    };

    $http.post(userService(0).address+"FormService.asmx/WeixiuForm",p).success(function (response, status, headers, config) {
      var str1 = '<div>定位成功</div>';
      var str = response.d;
      str = '<form>'+str;
      str  = str + '</form>';
      ts_css.innerHTML = str;
      alert(str)
    }).error(function (response, status, headers, config) {
      alert(response);
    });



    $scope.houseList = Houses.all();

    $scope.getPoints=function () {
      var UserObj={
        userId:userService(0).userInfo,
        code:"09",
        date:"20180719"
      }
      $http.post(userService(0).address+"LocationService.asmx/ReadPoints",UserObj).success(function (response, status, headers, config) {
          alert(angular.toJson(response.d))
      }).error(function (response, status, headers, config) {
          alert(angular.toJson(response))
      });
    };
    // $scope.loadcss = function () {
    //   var str = '<div>定位成功</div>';
    //   result.innerHTML = str;
    // }

  })
// 业务消息
  .controller('YW_ChatsCtrl', function($ionicLoading,$timeout,YWMesseges,$rootScope,$ionicPopup,$ionicSlideBoxDelegate,$state,userService,$stateParams,$http,$scope) {
    // $scope.$on('$ionicView.loaded', function() {
    //   alert("$ionicView.loaded");
    // });
    $scope.tabNames=['未处理','处理中','处理完成'];
    $scope.slectIndex=0;
    $scope.activeSlide=function(index){//点击时候触发
      $scope.slectIndex=index;
      // $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.slide($scope.slectIndex);
    };
    $scope.slideChanged=function(index){//滑动时候触发
      $scope.slectIndex=index;
    };
    YWMesseges.state0("0","  order by VISITDATE ").then(function(res){
      $scope.dataA=res.d;
    });
    YWMesseges.state0("7","  order by VISITDATE  ").then(function(res){
      $scope.dataB=res.d;
    });
    YWMesseges.state0("10","  order by VISITDATE desc  ").then(function(res){
      $scope.dataC=res.d;
    });

    $scope.accpectBF =function (item) {
      var p ={
        id:item.id,
        userName:$rootScope.userName,
      }
      $http.post(userService(0).address+"MessageService.asmx/Accept_YWBill",p).success(function (response, status, headers, config) {
        if(response.d)
        {
          $ionicLoading.show({
            template: '接收成功!'
          });

          YWMesseges.state0("7","  order by VISITDATE  ").then(function(res){
            $scope.dataB=res.d;
          });
          //$scope.dataB.push(item);
          $scope.dataA.splice($scope.dataA.indexOf(item), 1);
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 1000);
        }
        else
        {
          $ionicLoading.show({
            template: '处理失败!'
          });
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
      }).error(function (response, status, headers, config) {
        // alert(response);
      });
    }

    $scope.goto=function (item,type) {
      var myvar=true;
      var mybill=true;
      var mycomplete=true;
      if(type=='A')
      {
        myvar=false;
      }
      if(type=='B')
      {
        mybill=false;
      }
      if(type=='C')
      {
        mycomplete=false;
      }
      $state.go('tab.msg-detail',{item:item,myVar:myvar,myBill:mybill,myComplete:mycomplete});
    }
    $scope.doRefresh=function () {
      $ionicLoading.show({
        template: '正在刷新数据...'
      });
      var pa = {
        userName: $rootScope.userName,
        where:' and state = 0  order by VISITDATE  '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",pa).success(function (response, status, headers, config) {
        $scope.dataA = response.d;
      });
      var pb = {
        userName: $rootScope.userName,
        where:' and state = 7  order by VISITDATE  '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",pb).success(function (response, status, headers, config) {
        $scope.dataB = response.d;
      });
      var pc = {
        userName: $rootScope.userName,
        where:' and state = 10  order by VISITDATE  desc '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",pc).success(function (response, status, headers, config) {
        $scope.dataC = response.d;
        $ionicLoading.hide();
      }).error(function (response, status, headers, config) {
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请检查网络是否连接！'
        });
        $timeout(function() {
          alertPopup.close(); // 2秒后关闭弹窗
        }, 2000);
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.doRefresh_YW_A = function() {
      var p = {
        userName: $rootScope.userName,
        where:' and state = 0  order by VISITDATE  '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",p).success(function (response, status, headers, config) {
        $scope.dataA = response.d;
      }).error(function (response, status, headers, config) {
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请检查网络是否连接！'
        });
        $timeout(function() {
          alertPopup.close(); // 2秒后关闭弹窗
        }, 2000);
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.doRefresh_YW_B = function() {
      var p = {
        userName: $rootScope.userName,
        where:' and state = 7  order by VISITDATE  '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",p).success(function (response, status, headers, config) {
        $scope.dataB = response.d;
      }).error(function (response, status, headers, config) {
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请检查网络是否连接！'
        });
        $timeout(function() {
          alertPopup.close(); // 2秒后关闭弹窗
        }, 2000);
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
    $scope.doRefresh_YW_C = function() {
      var p = {
        userName: $rootScope.userName,
        where:' and state = 10  order by VISITDATE  desc '
      };
      $http.post(userService(0).address+"MessageService.asmx/YWBillGet",p).success(function (response, status, headers, config) {
        $scope.dataC = response.d;
      }).error(function (response, status, headers, config) {
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请检查网络是否连接！'
        });
        $timeout(function() {
          alertPopup.close(); // 2秒后关闭弹窗
        }, 2000);
      }).finally(function() {
        // 停止广播ion-refresher
        $scope.$broadcast('scroll.refreshComplete');
      });
    };
  })
// 维修消息
.controller('ChatsCtrl', function(wxBills,$ionicLoading,$timeout,$rootScope,$ionicPopup,$ionicSlideBoxDelegate,$state,userService,$stateParams,$http,$scope) {
  $scope.tabNames=['未处理','处理中','处理完成'];
  $scope.slectIndex=0;
  $scope.activeSlide=function(index){//点击时候触发
    $scope.slectIndex=index;
    $ionicSlideBoxDelegate.slide(index);
  };
  $scope.slideChanged=function(index){//滑动时候触发
    $scope.slectIndex=index;
  };
  wxBills.getState0(0).then(
    function (res) {
      $scope.dataA=res.d;
    }
  )
  wxBills.getState0(1).then(
    function (res) {
      $scope.dataB=res.d;
    }
  )
  wxBills.getState0(2).then(
    function (res) {
      $scope.dataC=res.d;
    }
  )

  $scope.onHold=function (item) {
    var myPopup = $ionicPopup.show({
      template: '确认拒绝【'+item.CLIENT+'】的派单？',
      title: '提示',
      subTitle: '单号：'+item.CODE,
      scope: $scope,
      buttons: [
        { text: '否' },
        {
          text: '<b>是</b>',
          type: 'button-positive',
          onTap: function(e) {
            var p ={
              userName : $rootScope.userName,
              type:'拒绝',
              id:item.ID,
              refercode:item.CODE,
            }
            $http.post(userService(0).address+"WeixiuService.asmx/RepairDeal",p).success(function (response, status, headers, config) {
              if(response.d==-10)
              {
                $ionicLoading.show({
                  template: '身份验证失败，请重新登录！'
                });
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 1500);
              }
              else if(response.d==-1)
              {
                $ionicLoading.show({
                  template: '接受失败，请联系管理员！'
                });
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 1500);
              }
              else if(response.d==0)
              {
                $ionicLoading.show({
                  template: '拒绝成功！'
                });
                $scope.dataA.splice($scope.dataA.indexOf(item), 1);
                wxBills.getState0(1).then(function (res) {$scope.dataB=res.d;});
                $timeout(function () {
                  $ionicLoading.hide(); // 2秒后关闭弹窗
                }, 1500);
              }
              else { }
            }).error(function (response, status, headers, config) {
              $ionicLoading.show({
                template: '网络连接失败！'
              });
              $timeout(function () {
                $ionicLoading.hide(); // 2秒后关闭弹窗
              }, 1500);
            });
          }
        },
      ]
    });
    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });
  }

  $scope.doRefresh = function() {
    $ionicLoading.show({
      template: '正在刷新数据...'
    });
    var pa = {
      userName: $rootScope.userName,
      type:0
    };
    $http.post(userService(0).address+"WeixiuService.asmx/AfterSRepair",pa).success(function (response, status, headers, config) {
      $scope.dataA = response.d;
    });

    var pb = {
      userName: $rootScope.userName,
      type:1
    };
    $http.post(userService(0).address+"WeixiuService.asmx/AfterSRepair",pb).success(function (response, status, headers, config) {
      $scope.dataB = response.d;
    });
    var pc = {
      userName: $rootScope.userName,
      type:2
    };
    $http.post(userService(0).address+"WeixiuService.asmx/AfterSRepair",pc).success(function (response, status, headers, config) {
      $scope.dataC = response.d;
      $ionicLoading.hide(); // 2秒后关闭弹窗
    }).finally(function() {
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.acceptWX=function (item) {
    var p ={
       userName : $rootScope.userName,
       type:'接受',
       id:item.ID,
       refercode:item.CODE,
    }
    $http.post(userService(0).address+"WeixiuService.asmx/RepairDeal",p).success(function (response, status, headers, config) {
        if(response.d==-10)
        {
          $ionicLoading.show({
            template: '身份验证失败，请重新登录！'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 1500);
        }
        else if(response.d==-1)
        {
          $ionicLoading.show({
            template: '接受失败，请联系管理员！'
          });
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 1500);
        }
        else if(response.d==0)
        {
          $ionicLoading.show({
            template: '接受成功！'
          });
          $scope.dataA.splice($scope.dataA.indexOf(item), 1);
          wxBills.getState0(1).then(function (res) {$scope.dataB=res.d;});
          $timeout(function () {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 1500);
        }
        else { }
    }).error(function (response, status, headers, config) {
        $ionicLoading.show({
          template: '网络连接失败！'
        });
        $timeout(function () {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 1500);
    });
  }

  $scope.GetDel=function (item,type) {
    var myVar=true;
    var myComplete=true;

    if(type==1)
    {
      myVar=false;
    }
    else  if(type==2)
    {
      myComplete=false;
    }
    $state.go('tab.wx-detail',{myVar:myVar,item:item,myComplete:myComplete});
  }



})
// 维修消息详情
  .controller('WxDetailCtrl', function($state,$rootScope,$scope, $stateParams, Chats) {
    $scope.item=$stateParams.item;
    if($stateParams.myVar!=null)
    {
      $scope.myVar=$stateParams.myVar;
    }
    else
    {
      $scope.myVar=true;//隐藏
    }
    if($stateParams.myComplete!=null)
    {
      $scope.myComplete=$stateParams.myComplete;
    }
    else
    {
      $scope.myComplete=true;//隐藏
    }

    $scope.writeWX=function (item) {
      $state.go('weixiu2',{item:item});
    }
  })

.controller('ChatDetailCtrl', function($rootScope,$scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
// 业务消息详情
  .controller('MsgDetailCtrl', function($ionicHistory,$timeout,$http,userService,$ionicLoading,$state,$rootScope,$scope, $stateParams,YWMesseges) {

    $scope.item=$stateParams.item;
    if($stateParams.myVar!=null)
    {
      $scope.myVar=$stateParams.myVar;
    }
    else
    {
      $scope.myVar=true;//隐藏
    }
    if($stateParams.myBill!=null)
    {
      $scope.myBill=$stateParams.myBill;
    }
    else
    {
      $scope.myBill=true;//隐藏
    }
    if($stateParams.myComplete!=null)
    {
      $scope.myComplete=$stateParams.myComplete;
    }
    else
    {
      $scope.myComplete=true;//隐藏
    }
    $scope.write=function (item) {
      $state.go('yewu1',{item:item});
    }

    $scope.accpect=function () {
      var p ={
        id:$scope.item.id,
        userName:$rootScope.userName,
      }
      $http.post(userService(0).address+"MessageService.asmx/Accept_YWBill",p).success(function (response, status, headers, config) {
        if(response.d)
        {
          $ionicLoading.show({
            template: '处理成功!'
          });
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
            //其他页面返回此页面时刷新数据
            $state.go('tab.msg',{},{reload:true,location:'replace'});
            // $scope.$on('$stateChangeSucess',function () {
            //   alert('$stateChangeSucess');
            // });//doRefresh为自定义的方法，可根据个人需要调用
            // $ionicHistory.goBack();
            //$state.go('tab.msg',{refresh:true});
          }, 2000);
        }
        else
        {
          $ionicLoading.show({
            template: '处理失败!'
          });
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
      }).error(function (response, status, headers, config) {
       // alert(response);
      });
    }

    $scope.back=function () {
      $state.go('tab.msg',{},{reload:true,location:'replace'});
    }
  })

  .controller('LocationCtrl', function($rootScope,$scope) {
    // var int=self.setInterval("clock()",5000)
    // function clock()
    // {
    //
    // }
    var AMapArea = document.getElementById('amap');
    var list_lineArr = new Array();//创建数组，存取
    AMapArea.parentNode.style.height = "100%";
    $scope.AMapId = 'container';
    $scope.mapObj;//存放初始化的地图对象
    $scope.geolocation;//存放地理位置对象
    $scope.positionObj;//存放地理位置对象
    $scope.lngX;
    $scope.latY;
    var toolbar;
    /**
     * 初始化地图
     */
    $scope.initAMap = function () {
      var position = new AMap.LngLat(116.397428, 39.90923);
      $scope.mapObj = new AMap.Map($scope.AMapId, {
        view: new AMap.View2D({
          //  center: position,
          zoom: 14,
          rotation: 0
        }),
        lang: 'zh_cn'
      });

      AMap.plugin(['AMap.ToolBar'],
        function(){
          toolopt = {
            // offset :new AMap.Pixel(10,10),//相对于地图容器左上角的偏移量，正数代表向右下偏移。默认为AMap.Pixel(10,10)
            /*
             *控件停靠位置
             *LT:左上角;
             *RT:右上角;
             *LB:左下角;
             *RB:右下角;
             *默认位置：LT
             */
            position : 'RB',
            ruler : true,//标尺键盘是否可见，默认为true
            noIpLocate : false,//定位失败后，是否开启IP定位，默认为false
            locate : false,//是否显示定位按钮，默认为false
            liteStyle : false,//是否使用精简模式，默认为false
            direction : false,//方向键盘是否可见，默认为true
            //  autoPosition : true,//是否自动定位，即地图初始化加载完成后，是否自动定位的用户所在地，在支持HTML5的浏览器中有效，默认为false
            locationMarker : AMap.Marker({map: $scope.mapObj }),
            /**
             *是否使用高德定位sdk用来辅助优化定位效果，默认：false.
             *仅供在使用了高德定位sdk的APP中，嵌入webview页面时使用
             *注：如果要使用辅助定位的功能，除了需要将useNative属性设置为true以外，
             *还需要调用高德定位idk中，AMapLocationClient类的startAssistantLocation()方法开启辅助H5定位功能；
             *不用时，可以调用stopAssistantLocation()方法停止辅助H5定位功能。具体用法可参考定位SDK的参考手册
             */
            useNative : false
          }
          toolbar= new AMap.ToolBar(toolopt);
          //toolbar.hide();//隐藏toolbar
          $scope.mapObj.addControl(toolbar);
          //启动监听
          toolbar.on('location',function(){
            alert(toolbar.getLocation());
          });
        }
      );


      AMap.plugin('AMap.Geolocation', function () {
        $scope.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认:true
          timeout: 10000,           // 超过10秒后停止定位，默认：无穷大
          maximumAge: 0,            // 定位结果缓存0毫秒，默认：0
          convert: true,            // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,         // 显示定位按钮，默认：true
          buttonPosition: 'LB',     // 定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,         // 定位成功后在定位到的位置显示点标记，默认：true
          showCircle: false,         // 定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,      // 定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy:true,       // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false

        });
        $scope.mapObj.addControl($scope.geolocation);
        $scope.geolocation.getCurrentPosition();//进入后直接调用
        $scope.geolocation.watchPosition();//监控当前位置
        AMap.event.addListener($scope.geolocation, 'complete', onComplete); // 返回定位信息
        AMap.event.addListener($scope.geolocation, 'error', onError);       // 返回定位出错信息
        list_lineArr.push(new AMap.LngLat($scope.lngX, $scope.latY));
        // marker = new AMap.Marker({
        //   icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        //   position: list_lineArr[0]
        // });
        // marker.setMap($scope.mapObj);
        // window.setInterval(function () {
        //   $scope.geolocation.getCurrentPosition();
        //   AMap.event.addListener($scope.geolocation, 'complete', onComplete); // 返回定位信息
        //   AMap.event.addListener($scope.geolocation, 'error', onError);       // 返回定位出错信息
        // },2000);
        //
        window.setInterval(
          function () {
            list_lineArr.push(new AMap.LngLat($scope.lngX, $scope.latY));
            // alert('经度：'+$scope.lngX+'纬度：'+$scope.latY);
          }
          ,60000);
      });
    };
    //获取当前位置信息
    $scope.getCurrentPosition=function() {
      $scope.geolocation.getCurrentPosition();
    };
    //监控当前位置并获取当前位置信息
    $scope.watchPosition=function() {
      $scope.geolocation.watchPosition();
    };
    //解析定位结果
    function onComplete (data) {
      var str = '<div>定位成功</div>';
      str += '<div>经度：' + data.position.getLng() + '</div>';
      str += '<div>纬度：' + data.position.getLat() + '</div>';
      str += '<div>精度：' + data.accuracy + ' 米</div>';
      str += '<div>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</div>';
      // str += '<div>地址信息：' + JSON.stringify(data.addressComponent, null, 4)+ '</div>';
      result.innerHTML = str;
      $scope.lngX = data.position.getLng();//经度
      $scope.latY = data.position.getLat();//纬度
      drawLine();

      // var res = '经纬度：' + obj.position +
      //   '\n精度范围：' + obj.accuracy +
      // '米\n定位结果的来源：' + obj.location_type +
      // '\n状态信息：' + obj.info +
      // '\n地址：' + obj.formattedAddress +
      // '\n地址信息：' + JSON.stringify(obj.addressComponent, null, 4);
    };
    //解析定位错误信息
    function onError (data) {
      var str = '<p>定位失败</p>';
      str += '<p>错误信息：'
      switch(data.info) {
        case 'PERMISSION_DENIED':
          str += '浏览器阻止了定位操作';
          break;
        case 'POSITION_UNAVAILBLE':
          str += '无法获得当前位置';
          break;
        case 'TIMEOUT':
          str += '定位超时';
          break;
        default:
          str += '未知错误';
          break;
      }
      str += '</p>';
      result.innerHTML = str;
    };

    function  drawLine() {
      polyline = new AMap.Polyline({
        path: list_lineArr, //设置线覆盖物路径
        strokeColor: "#3366FF", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 5, //线宽
        strokeStyle: "solid", //线样式
        strokeDasharray: [10, 5] //补充线样式
      });
      polyline.setMap($scope.mapObj);
    }

    /**
     * 在标记点画圆
     */
    $scope.addCircle = function () {
      //初始化待编辑的圆实例
      var circle = new AMap.Circle({
        map: $scope.mapObj,
        center: new AMap.LngLat("116.397428", "39.90923"),
        radius: 1000,
        strokeColor: '#F33',
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: '#ee2200',
        fillOpacity: 0.35
      });
      //加载圆编辑插件
      var circleEditor;
      $scope.mapObj.plugin(["AMap.CircleEditor"], function () {
        //实例化时指定地图对象
        circleEditor = new AMap.CircleEditor($scope.mapObj, circle);
      });
    };
    /**
     * 划线
     */
    $scope.addLine = function (lineArr) {
      polyline = new AMap.Polyline({
        path: lineArr, //设置线覆盖物路径
        strokeColor: "#3366FF", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 5, //线宽
        strokeStyle: "solid", //线样式
        strokeDasharray: [10, 5] //补充线样式
      });
      polyline.setMap($scope.mapObj);
      // for(var p in lineArr) {
      //   marker = new AMap.Marker({
      //     position: markers[p],
      //     map: map
      //   });
      // }
    };


// 实例化点标记
    function addMarker(lnglatXY) {

      marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglatXY
      });
      marker.setMap(map);
      map.setFitView();// 执行定位
    }

    /**
     * 点击地图增加锚点
     */

    $scope.ListenClick=function(){
      AMap.event.addListener($scope.mapObj,'click',function(e){
        var lnglat=e.lnglat;
        marker=new AMap.Marker({
          map:$scope.mapObj,
          position:e.lnglat,
          icon:"http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          offset:new AMap.Pixel(-10,-34)
          // content:m
        });
        $scope.mapObj.setCenter(lnglat);
      });
    };
    /**
     * 回退到上一个页面
     */
    $scope.goBack = function(){
      // var  url = historyUrlService.getBackUrl();
      // if(url == ""){
      //   historyUrlService.goUrlByState("index");
      // }else{
      //   historyUrlService.goUrlBuyUrl(url);
      // }
      window.history.back();
    };
  })
// 登录
  .controller('LoginCtrl', function($ionicLoading,comlocation,$cookies, $cookieStore,$interval,$rootScope,$cordovaGeolocation,$scope,$http,$state,userService,roleService,$ionicPopup,$timeout,platformService) {
    if (localStorage.getItem("userId")){
      document.getElementById("userId").value = localStorage.getItem("userId");
    }
    if (localStorage.getItem("password")) {
      document.getElementById("password").value = localStorage.getItem("password");
    }

    $scope.onClickLogin=function() {
      $ionicLoading.show({
        template: '正在验证信息...'
      });
      var log_id= document.getElementById("userId").value;
      var log_pwd= document.getElementById("password").value;
      var uuid = device.uuid;
      var UserObj = {
        userId: log_id,
        password: log_pwd,
        uuid:uuid
      };

      $http.post(userService(0).address+"LoginService.asmx/WS2",UserObj).success(function (response, status, headers, config) {
      //  var get_back =angular.toJson(response, true);
      //  alert(get_back);  //查看返回的结构，然后一层一层去取数据
        // var get_data = userService(0, 0, false);//读取全局变量
        // alert(get_data);

        $ionicLoading.hide();

        if(response.d.status==0)
        {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '用户不存在！'
          });
          $timeout(function() {
            alertPopup.close(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d.status==5)
        {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '密码错误！'
          });
          $timeout(function() {
            alertPopup.close(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d.status==10)
        {
          $rootScope.getMyPosition();
          $rootScope.userinfo=log_id;
          $rootScope.pwd=log_pwd;
          $rootScope.uuid=device.uuid;
          $rootScope.userName=response.d.name;
          $rootScope.authorised=response.d.authorised;
          userService(1,log_id);
          userService(3,response.d.name);
          //alert(response.d.session+"::"+response.d.cookies);
          // var expireDate = new Date();
          // expireDate.setDate(expireDate.getDate() + 1);
          //客户端的sessionid没有：增加||新的跟原来的不一样增加
          // if($cookies.get("guid")==null||$cookies.get("guid")!=response.d.session)
          // {
          //   $cookies.put("guid",response.d.session);
          // }
          // if(log_id!=localStorage.getItem("userId"))
          // {
            localStorage.clear();
            // this.navCtrl.setRoot(LoginPage);
            localStorage.setItem("userId",log_id);
            localStorage.setItem("password",log_pwd);
            localStorage.setItem("uuid",device.uuid);
            localStorage.setItem("userName",response.d.name);
            localStorage.setItem("authorisedPages", response.d.authorised);
          // }
          alert('hello!');
          window.location.href = '#tab/dash';
        }
        else
        {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '未知的错误！'
          });
          $timeout(function() {
            alertPopup.close(); // 2秒后关闭弹窗
          }, 2000);
        }
      }).error(function (error) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '提示',
          template: '请检查网络是否连接！'
        });
        $timeout(function() {
          alertPopup.close(); // 2秒后关闭弹窗
        }, 2000);
      });
    };
  })
// 事务
.controller('AccountCtrl', function(bfBills,$http,userService,$ionicLoading,$timeout,comlocation,$rootScope,$scope) {
  $scope.settings = {
    enableFriends: true
  };
  $scope.sign=function (type) {
    $ionicLoading.show({
      template: '正在获取位置...'
    });
    comlocation.exec().then(function (success) {
      var p = {
        userId:$rootScope.userinfo,
        type:type,
        lng:$rootScope.lng,
        lat:$rootScope.lat
      }
      //alert(angular.toJson(p));
      $http.post(userService(0).address+"AccountService.asmx/Sign",p).success(function (response, status, headers, config) {
        // -1：没有该人员  -2:没有任何单子  -3:距离超长  -4:已签到  0：成功
        if(response.d==-1)
        {
          $ionicLoading.show({template: '没有查询到人员信息!'});
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d==-2)
        {
          $ionicLoading.show({template: '打卡失败!'});
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d==-3)
        {
          $ionicLoading.show({template: '不在范围内!'});
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d==-4)
        {
          $ionicLoading.show({template: '已签到!'});
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
        else if(response.d==0)
        {
          $ionicLoading.show({template: '打卡成功!'});
          $timeout(function() {
            $ionicLoading.hide(); // 2秒后关闭弹窗
          }, 2000);
        }
        else
        {}
      }).error(function (response, status, headers, config) {
        $ionicLoading.show({template: '打卡失败!'});
        $timeout(function() {
          $ionicLoading.hide(); // 2秒后关闭弹窗
        }, 2000);
      });
    },function (error) {
      $ionicLoading.show({
        template: '定位失败!'
      });
      $timeout(function() {
        $ionicLoading.hide(); // 2秒后关闭弹窗
      }, 2000);
    })
  }
  $scope.goto=function (type) {
    if(type=='A')
    {
      window.location.href = '#/tab/account/conference';
    }
    if(type=='B')
    {
      window.location.href = '#/tab/account/feesubmit';
    }
  }
})

.controller('AMapCtrl', function($interval,$ionicLoading,comlocation,$http,gtMapService,$rootScope,$scope,aMapServ,userService,$state,$ionicPopup,$timeout) {
  if(userService(0).if_map)//需定位人员
  {
  $rootScope.timer=$interval(setPositon,120000);
   window.setInterval(setPositon,120000);//2分钟发一次定位
  }
  function setPositon () {
    comlocation.exec().then(function (success) {
      $rootScope.sendMyPosition()
    },function (error) {
      // alert('获取当前位置失败：'+angular.toJson(error));
    })
    // $rootScope.getMyPosition();
  }

  $scope.scheduleSingleNotification = function () {
    cordova.plugins.notification.local.schedule({
      id: 1,
      title: '应用提醒',
      text : '应用有新消息,快来查看吧',
      at: new Date(),
     // every: 'minute'
    });
  };

  //==============================客户搜索 start=======================================
  $('body').click(function(e) {
    $('#kflist').hide();
  });
  $("#kflist").hide();
  $scope.searchName;
  $scope.searchCN=function(){
    var p = {
      userId: userService(0).userInfo,
      searchName:$scope.searchName
    };
    if(p.searchName.length>0)
    {
      if(parseFloat($scope.searchName).toString() != "NaN")
      {
        if(p.searchName.length>=3)
        {
          $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
            .success(function (response, status, headers, config) {
              $scope.dataKF=response.d;
              $("#kflist").show();
            })
            .error(function (response, status, headers, config) {
              alert(angular.toJson(response));
            });
        }
      }
      else
      {
        $http.post(userService(0).address + "LoginService.asmx/KFKF", p)
          .success(function (response, status, headers, config) {
            $scope.dataKF=response.d;
            $("#kflist").show();
          })
          .error(function (response, status, headers, config) {
            alert(angular.toJson(response));
          });
      }
    }
    else
    {
      $scope.dataKF=null;
      $("#kflist").hide();
    }
  };
  $scope.it_click=function (item) {
    $scope.searchName = item.NAME;
    // client_id=item.ID;
    $("#kflist").hide();
  };
//==============================客户搜索=end======================================
//===============================周围客户 start=======================================
  var infoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30),
    size:new AMap.Size(230,0)
  });     //创建信息窗口对象  ps.高德目前不支持多信息窗口，即使创建多个窗口对象，也只会显示一个 10/26/2016
  var addMarkers=[];
  var kflist;
  function clear() {
    $scope.mapObj.remove(addMarkers);
    addMarkers = [];
    infoWindow.close();
    $scope.mapObj.clearMap();
  }
  $scope.EnterFlag=0;//是否是第一次进来
  $scope.getMap = function (chose) {
    if($scope.EnterFlag==0)
    {
      $scope.initAMap();
    }
    comlocation.exec().then(function (success) {
        //$scope.mapObj.clearMap();
        var p ={
          type:chose,
          lng:$rootScope.lng,
          lat:$rootScope.lat
        };
        alert(angular.toJson(p));
        $http.post(userService(0).address + "LocationService.asmx/Neighbour", p)
          .success(function (response, status, headers, config) {
            kflist=response.d;
            clear();//清除原来的信息
            for (var i = 0; i < kflist.length; i++) {
              var POI = new AMap.LngLat(kflist[i].lng, kflist[i].lat);
              addKFmarker(POI, kflist[i]);
            }
          })
          .error(function (response, status, headers, config) {
            alert(angular.toJson(response));
            //alert('请确认是否填写用户名称和用户地址，检查网络是否连接！');
          });
      },function (error) {
        alert('获取当前位置失败：'+angular.toJson(error))
      }
    );
  }
//客户标记
  function  addKFmarker(poi,obj) {
    marker=new AMap.Marker({
      position:poi,        //采用默认样式，无需自定义
      map:$scope.mapObj,
      offset: new AMap.Pixel(-10, -34),
      // icon: new AMap.Icon({
      //   // size: new AMap.Size(40, 50),
      //   cour:1,
      //   image: "img/marker_red.png"     //自定义的标记图片样式(图片需自己准备)
      // })
    });
    content=[];
    content.push('['+obj.type+']');
    content.push('公司名称：'+obj.name);
    content.push('上次回访时间：'+obj.lastVisit);
    marker.content = content;
    marker.extData = {'name':obj.name,'data':obj}
    marker.on('click', u_markerClick);
    addMarkers.push(marker);
  }

  //信息窗口
  function u_markerClick(e){
    document.getElementById("gothereN").value=e.target.extData.name;
    //$scope.searchName=e.target.extData.name;
    infoWindow.setContent(e.target.content.join('<br/>'));
    infoWindow.open($scope.mapObj, e.target.getPosition());
  }
  //===============================周围客户 end=======================================

  $scope.$on("$destroy", function () {
    //清除配置,不然scroll会重复请求,每次进来都是新页面
    $scope.EnterFlag=0;
  });

  //============================地图start================================
  var AMapArea = document.getElementById('amap');
  var list_lineArr = new Array();//创建数组，存取
  AMapArea.parentNode.style.height = "100%";
  $scope.AMapId = 'container';
  $scope.geolocation;//存放地理位置对象
  $scope.lngX=0000;
  $scope.latY=0000;
  /**
   * 是否记录路径
   */
  $scope.initAMap = function () {
    $scope.EnterFlag=1;
    if(userService(0).if_map)//需定位人员
    {
      if($scope.mapObj==null)
      {
        $scope.mapObj = aMapServ.all();
      }
      AMap.plugin('AMap.Geolocation', function () {
        if($scope.geolocation==null)
        {
          $scope.geolocation = aMapServ.geo();
          $scope.mapObj.addControl($scope.geolocation);
        }
        // list_lineArr.push(new AMap.LngLat($scope.lngX, $scope.latY)); // 放置第一个点
         $scope.geolocation.getCurrentPosition();//进入后直接调用
         $scope.geolocation.watchPosition();//监控当前位置
         AMap.event.addListener($scope.geolocation, 'complete', onComplete); // 返回定位信息
         AMap.event.addListener($scope.geolocation, 'error', onError);       // 返回定位出错信息
      });

    }
  };

  //解析定位结果
  function onComplete (data) {
    var str = '<div>定位成功</div>';
    str += '<div>经度：' + data.position.getLng() + '</div>';
    str += '<div>纬度：' + data.position.getLat() + '</div>';
    // str += '<div>精度：' + data.accuracy + ' 米</div>';
    str += '<div>是否经过偏移：' + (data.isConverted ? '是' : '否') + '</div>';
    // str += '<div>地址信息：' + JSON.stringify(data.addressComponent, null, 4)+ '</div>';
    result.innerHTML = str;
   // $scope.lngX = data.position.getLng();//经度
    // $scope.latY = data.position.getLat();//纬度
    //alert($scope.lngX +":"+$scope.latY);
   // drawLine();
  };
  //解析定位错误信息
  function onError (data) {
    var str = '<p>定位失败</p>';
    str += '<p>错误信息：'
    switch(data.info) {
      case 'PERMISSION_DENIED':
        str += '浏览器阻止了定位操作';
        break;
      case 'POSITION_UNAVAILBLE':
        str += '无法获得当前位置';
        break;
      case 'TIMEOUT':
        str += '定位超时';
        break;
      default:
        str += '未知错误';
        break;
    }
    str += '</p>';
    result.innerHTML = str;
  };

  function  drawLine() {
    polyline = new AMap.Polyline({
      path: list_lineArr, //设置线覆盖物路径
      strokeColor: "#3366FF", //线颜色
      strokeOpacity: 1, //线透明度
      strokeWeight: 5, //线宽
      strokeStyle: "solid", //线样式
      strokeDasharray: [10, 5] //补充线样式
    });
    polyline.setMap($scope.mapObj);
  }
  /**
   * 在标记点画圆
   */
  $scope.addCircle = function () {
    //初始化待编辑的圆实例
    var circle = new AMap.Circle({
      map: $scope.mapObj,
      center: new AMap.LngLat("116.397428", "39.90923"),
      radius: 1000,
      strokeColor: '#F33',
      strokeOpacity: 1,
      strokeWeight: 3,
      fillColor: '#ee2200',
      fillOpacity: 0.35
    });
    //加载圆编辑插件
    var circleEditor;
    $scope.mapObj.plugin(["AMap.CircleEditor"], function () {
      //实例化时指定地图对象
      circleEditor = new AMap.CircleEditor($scope.mapObj, circle);
    });
  };

// 实例化点标记
  function addMarker(lnglatXY) {

    marker = new AMap.Marker({
      icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
      position: lnglatXY
    });
    marker.setMap(map);
    map.setFitView();// 执行定位
  }
  /**
   * 点击地图增加锚点
   */
  $scope.ListenClick=function(){
    AMap.event.addListener($scope.mapObj,'click',function(e){
      var lnglat=e.lnglat;
      marker=new AMap.Marker({
        map:$scope.mapObj,
        position:e.lnglat,
        icon:"http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        offset:new AMap.Pixel(-10,-34)
        // content:m
      });
      $scope.mapObj.setCenter(lnglat);
    });
  };
  //获取当前位置信息
  $scope.getCurrentPosition=function() {
    $scope.geolocation.getCurrentPosition();
  };
  //监控当前位置并获取当前位置信息
  $scope.watchPosition=function() {
    $scope.geolocation.watchPosition();
  };
  //===============================地图end==================================

//==================================导航start=======================================
  var kfarr;
  $scope.applist;
  $scope.GoThere=function (kfname) {
    var p = {
      client: document.getElementById("gothereN").value,
    };
    $scope.searchName=document.getElementById("gothereN").value;
    if (p.client == "") {
      var alertPopup = $ionicPopup.alert({
        title: '提示',
        template: '请先输入客户！'
      });
      $timeout(function() {
        alertPopup.close(); // 2秒后关闭弹窗
      }, 2000);
    }
    else {
      $http.post(userService(0).address + "YewuService.asmx/GetKFLoc", p)
        .success(function (response, status, headers, config) {
          if(response.d=="")
          {
            var alertPopup = $ionicPopup.alert({
              title: '提示',
              template: '该客户未标记地址！'
            });
            $timeout(function() {
              alertPopup.close(); // 2秒后关闭弹窗
            }, 2000);
          }
          else if(response.d=="none")
          {
            var alertPopup = $ionicPopup.alert({
              title: '提示',
              template: '不存在该用户！'
            });
            $timeout(function() {
              alertPopup.close(); // 2秒后关闭弹窗
            }, 2000);

          }
          else
          {
            kfarr = response.d.split(",");
            $scope.applist = gtMapService.all();
            //lat,lng,kflat,kflng,name
            if($scope.applist.length>0)
            {
              choseApp();
              // comlocation.exec().then(
              //   function (success) {
              //     choseApp();
              //   },function (error) {
              //     alert('无法获取当前位置！');
              //   }
              // );
            }
            else
            {
              var pop =  $ionicPopup.show({
                title:"提示",
                template: "请先下载百度地图或者高德地图！",
                buttons: [
                  { text: '取消' }
                ]
              });
              $timeout(function() {
                pop.close(); // 2秒后关闭弹窗
              }, 2000);
            }
          }
        })
        .error(function (response, status, headers, config) {
          var alertPopup = $ionicPopup.alert({
            title: '提示',
            template: '请检查您的网络是否已连接！'
          });
          $timeout(function() {
            alertPopup.close(); // 2秒后关闭弹窗
          }, 2000);
        });
    }
  }

  //选择地图
  function choseApp () {
    var pop =  $ionicPopup.show({
      title:"选择地图",
      template: "<ion-item ng-repeat='item in applist' ng-click='selectApp(item)'>{{ item.name }} </ion-item>",
      scope: $scope,
      buttons: [
        { text: '取消' }
      ]
    });
    $timeout(function() {
      pop.close(); // 2秒后关闭弹窗
    }, 2000);
  }
  $scope.selectApp=  function (item) {
    gtMapService.geo(item,0,0,kfarr[1],kfarr[0],$scope.searchName);
  }
  //==================================导航end=======================================
  //
  // console.info(device);
  // console.info(device.cordova);   //获取当前cordova的版本，‘’
  // console.info(device.model);     //device.model返回设备的模型或产品名称。该值由设备制造商设置，并且可能在同一产品的不同版本中不同。
  // console.info(device.uuid);      //获取设备通用唯一标识uuid，例如：‘78ca1fe2c1d3b584’
  // console.info(device.platform);  //获取操作系统名称，例如：‘Android’
  // console.info(device.version);   //获取操作系统版本，例如：‘4.4.4’
  // console.info(device.isVirtual); //判断设备是否在虚拟机上运行，在‘VS Emulator’返回false，所以这个不一定确实
  // console.info(device.serial);    //获取设备序列号，例如：‘unknown’
  // console.info(device.manufacturer);//获取设备制造商，例如：‘VS Emulator’
//   var scheme;
// // 不同的平台实现方式是不同的
//   if (ionic.Platform.isAndroid()) {
// //android
//     scheme = 'com.baidu.BaiduMap';
//     appAvailability.check(
//       scheme, // URI Scheme or Package Name
//       function() { // Success callback
//         alert(scheme + ' is available :)');
//         var sApp = startApp.set({ /* params */
//           "action":"ACTION_MAIN",
//           "category":"CATEGORY_DEFAULT",
//           "type":"text/css",
//           "package":"com.baidu.BaiduMap",
//           "uri":"file://data/index.html",
//           "flags":["FLAG_ACTIVITY_CLEAR_TOP","FLAG_ACTIVITY_CLEAR_TASK"],
//           // "component": ["com.android.GoBallistic","com.android.GoBallistic.Activity"],
//           "intentstart":"startActivity",
//         }, { /* extras */
//           "EXTRA_STREAM":"extraValue1",
//           "extraKey2":"extraValue2"
//         });
//         sApp.start(function() { /* success */
//           alert("OK");
//         }, function(error) { /* fail */
//           alert(error);
//         });
//       },
//       function() { // Error callback
// // 不存在对应APP
//         alert(scheme + ' is not available :(');
// // 打开百度地图下载地址
//         window.open("market://search?q=com.baidu.BaiduMap")
//       }
//     );
//   } else {
// // ios
//     scheme = 'baidu://';
//     appAvailability.check(
//       scheme, // URI Scheme or Package Name
//       function() { // Success callback
//         alert(scheme + ' is available :)');
//         var sApp = startApp.set("baidumap://");
//         sApp.start(function() { /* success */
//           alert("OK");
//         }, function(error) { /* fail */
//           alert(error);
//         });
//       },
//       function() { // Error callback
//         alert(scheme + ' is not available :(');
// // 打开store下载百度地图 window.open("https://itunes.apple.com/cn/app/id452186370")
//       }
//     );
//   }
//百度APP
//   var scheme
//   scheme = 'baidu://';
//   scheme = 'com.baidu.BaiduMap';
//
//   //高德APP
//   var schemeIntent;   // 地图APP Package Name
//   if(device.platform === 'iOS') {
//     scheme = 'baidu://';//百度
//     schemeIntent="iosamap://"//高德
//   }else if(device.platform === 'Android') {
//     scheme = 'com.baidu.BaiduMap';//百度
//     schemeIntent = 'com.autonavi.minimap';//高德
//   }
//   appAvailability.check(schemeIntent,hasAndroidPackage,notAndroidPackage);   //Android
//   function hasAndroidPackage() {  // 存在对应APP
//   var sApp = startApp.set({  //跳转对应APP
//     "action":"ACTION_VIEW",
//     "category":"CATEGORY_DEFAULT",
//     "type":"text/css",
//     "package":schemeIntent,
//       // "com.autonavi.minimap", $scope.lngX  $scope.latY
//     "uri":"amapuri://route/plan/?sid=BGVIS1&slat="+$scope.latY+"&slon="+$scope.lngX+"&sname=A&did=BGVIS2&dlat=39.98848272&dlon=116.47560823&dname=B&dev=0&t=0",   //我是选择路径规划然后导航的，当然你也可以直接用导航路径或者其他路径
//     "flags":["FLAG_ACTIVITY_CLEAR_TOP","FLAG_ACTIVITY_CLEAR_TASK"],
//     "intentstart":"startActivity",
//   }, { /* extras */
//     "EXTRA_STREAM":"extraValue1",
//     "extraKey2":"extraValue2"
//   });
//   sApp.start(function() { //跳转成功
//     alert("OK");
//   }, function(error) { //失败
//     alert(error);
//   });
// }
// function notAndroidPackage() {  // 不存在对应APP
//   alert('请更换地图APP或下载该地图APP');
// }
//   appAvailability.check(schemeIntent,hasIosPackage,notIosPackage);   //IOS
//   function hasIosPackage() {  // 存在对应APP
//     var sApp = startApp.set("iosamap://path?sourceApplication=applicationName&sid=BGVIS1&slat=39.92848272&slon=116.39560823&sname=A&did=BGVIS2&dlat=39.98848272&dlon=116.47560823&dname=B&dev=0&t=0");
//     sApp.start(function() {
//       alert("OK");
//     }, function(error) {
//       alert(error);
//     });
//   }
//   function notIosPackage() {  // 不存在对应APP
//     alert('请更换地图APP或下载该地图APP');
//   }

// let schemeIntent;   // 地图APP Package Name
  // if(device.platform === 'iOS') {
  //   schemeIntent="iosamap://"
  // }else if(device.platform === 'Android') {
  //   schemeIntent = 'com.autonavi.minimap';
  // }
  /**
   * 回退到上一个页面
   */
  $scope.goBack = function(){
    // var  url = historyUrlService.getBackUrl();
    // if(url == ""){
    //   historyUrlService.goUrlByState("index");
    // }else{
    //   historyUrlService.goUrlBuyUrl(url);
    // }
    window.history.back();
  };

  $scope.create=function () {
   $state.go('test');
  }
})
// 三个Tab 页
  .controller("ContentController",function ($rootScope,$scope, $ionicSideMenuDelegate) {
    //tab 页隐藏 ng-if
    $scope.data = {
      myBF: true,
      myWX: true,
    };
    // ng-hide 指令用于在表达式为 true显示，false移除
    // ng-if 指令用于在表达式为 false移除，true显示

    $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
    };
  });

// .controller("DemoaCtrl",function($scope,$ionicSideMenuDelegate){
//   $scope.left=["item0","item1","item2","item3","item4","item5","item6",
//     "item7","item8","item9","item10","item11","item12","item13"];
//   $scope.dian=function(){
//     $ionicSideMenuDelegate.toggleLeft();
//   };
// })
