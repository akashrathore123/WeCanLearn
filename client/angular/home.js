var app = angular.module('home',[]);
app.controller('demoForm',function($scope,$http,$window){

  document.getElementById("demoResponse").innerHTML = "";

  $scope.bookDemo = function(){
    var demo =JSON.stringify($scope.user);


    $http({


             method : 'POST',
             url : 'http://localhost:3000/api/Schools/bookDemo',
             headers: {'Content-Type': 'application/json'},
             data : demo
         }).
         success(function(data,status,headers,config){
              document.getElementById("submit").disabled = "true";
              document.getElementById("demoResponse").innerHTML = "<strong>Thank You !</strong> Your response has been recorded. ";

              return;

         })
    .error(function(data,status,headers,config){


      document.getElementById("demoResponse").innerHTML = data.error.message;
  });
}
});
