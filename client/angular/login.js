var app = angular.module('login',[]);
app.controller('registerAction',function($scope,$http,$window){

  $scope.schoolRegister = function(){

      var school =JSON.stringify($scope.register);


      $http({


               method : 'POST',
               url : 'http://localhost:3000/api/Schools/registerSchool',
               headers: {'Content-Type': 'application/json'},
               data : school
           }).
           success(function(data,status,headers,config){
                document.getElementById("registerSubmit").disabled = "true";
                document.getElementById("registerResponse").innerHTML = "<strong>Thank You !</strong> Email has been sent to verify account. ";

                return;

           })
      .error(function(data,status,headers,config){


        document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*"+data.error.message+"</span>";
    });

  }

});


app.controller('loginAction',function($scope,$http,$window){
  $scope.schoolLogin = function(){
      var school =JSON.stringify($scope.login);


      $http({


               method : 'POST',
               url : 'http://localhost:3000/api/Schools/loginSchool',
               headers: {'Content-Type': 'application/json'},
               data : school
           }).
           success(function(data,status,headers,config){
             document.getElementById("loginResponse").innerHTML = data;

                return;

           })
      .error(function(data,status,headers,config){

        document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
        return;
    });

  }

});
