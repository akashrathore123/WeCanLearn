var util = require("../util");
var validate = require("../util/validation");
var mail = require("../util/mailer");
var uuid = require("node-uuid");
var constant = require("../util/constants");
var path = require('path');
var loopback = require('loopback');
var http = require('http');

module.exports = function(School) {


  /* --------- School registration method ------------*/

School.registerSchool = function(data,cb){


  if(!data.name || !data.address || !data.city || !data.password || !data.phone || !data.email){

    cb(util.getGenericError("Error",422,"Invalid data received."));
    return;
       }

   if(!validate.isSchoolName(data.name)){
        cb(util.getGenericError("Error",400,"Invalid School Name."));
        return;
   }

   if(!validate.isName(data.city)){
        cb(util.getGenericError("Error",400,"Invalid city."));
        return;
   }

  if(!validate.isEmail(data.email)){
         cb(util.getGenericError("Error",400,"Invalid email."));
         return;
   }
  if(!validate.isPhone(data.phone)){
         cb(util.getGenericError("Error",400,"Invalid Phone."));
         return;
   }

 School.findOne({where:{email_id:data.email}},function(err,schoolInstance){

     if(err){
       console.log(err);
       cb(util.getInternalServerError(err));
       return;
        }
     if(schoolInstance){
        cb(util.getGenericError("Error",400,"Email already exist"));
        return;
        }


});

      var userid = data.email.split('@');
      userid = userid[0];
      var uuid5 = uuid.v4();
      var currentTime = new Date();

  School.findOne({where:{user_id:userid+'@wecanlearn.in'}},function(err,schoolInstance){

            if(err){
              console.log(err);
              cb(util.getInternalServerError("Error",500,"Internal Server Error"));
              return;
               }
            if(schoolInstance){
              userid = userid+uuid5.charAt(0);

            }

   var registerData = {
                      "user_id": userid+'@wecanlearn.in',
                      "email_id": data.email,
                      "password": data.password,
                      "name": data.name,
                      "address": data.address,
                      "city": data.city,
                      "phone": data.phone,
                      "students": {},
                      "verified": "No",
                      "demo": "Not Done",
                      "tokenID": uuid5,
                      "createdAt": currentTime
                    };

    var myMessage = {text:constant.HOST_NAME+"/api/schools/activateAccount/?tokenID="+uuid5};

    var renderer = loopback.template(path.resolve(__dirname, '../util/templates/activation.ejs'));
    html_body = renderer(myMessage);
  //  console.log(html_body);
    School.create(registerData,function(err){
               if(err){
                            console.log(err);
                            cb(util.getGenericError("Error",500,"Registration could not complete."));
                            return;
                        }
               else{

                           mail.send(data.email,"Account Verification",html_body);
                           cb(null,"Registered Successfully.");
                           return;
                      }
          });
});

}


/* --------- Account activation method ------------*/

School.activateAccount = function(tokenId,req,resp,cb){
console.log("hello");
School.findOne({where:{tokenID:tokenId}},function(err,schoolInstance){
  if(err){
    console.log(err);
    cb(util.getGenericError("Error",500,"Internal Server Error."));
    return;
  }
  if(schoolInstance){
    schoolInstance.updateAttribute("verified","Yes",function(err,schoolActivated){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error."));
        return;
      }else{
      //  var app = loopback();

      resp.statusCode = 302;
      resp.setHeader("Location", "../../../www.wecanlearn.in");
      resp.end();

        // cb(null,resp);

    }

    });
  }
});
}


/* --------- Demo booking method ------------*/

School.bookDemo = function(data,cb){
  if(!data.name || !data.phone || !data.email){
    console.log(data);
        cb(util.getGenericError("Error",422,"Incomplete Data."))
        return;
    }

    if(!validate.isName(data.name)){
         cb(util.getGenericError("Error",400,"Invalid  Name."));
         return;
    }

   if(!validate.isEmail(data.email)){
          cb(util.getGenericError("Error",400,"Invalid email."));
          return;
    }
   if(!validate.isPhone(data.phone)){
          cb(util.getGenericError("Error",400,"Invalid Phone."));
          return;
    }else {


       var message = {text:""}
       var renderer = loopback.template(path.resolve(__dirname, '../util/templates/demoConfirmation.ejs'));
       var html_body = renderer(message);
       mail.send(data.email,"Demo Confirmation | WeCanLearn",html_body);

       var message = {name:" "+data.name,email:" "+data.email,phone:" "+data.phone,message:" "+data.message};
       var renderer = loopback.template(path.resolve(__dirname, '../util/templates/demoReminder.ejs'));
       var html_body = renderer(message);
       mail.send("help@wecanlearn.in","Demo Reminder | WeCanLearn",html_body);
       console.log("sent");
       cb(null,"Demo Booked Successfully!");
       return;
    }
  }


  /* --------- School login method ------------*/

School.loginSchool = function(data,cb){
  if(!data.email || !data.password){
    cb(util.getGenericError('Error',422,'Incomplete Data.'));
    return;
  }

  if(!validate.isEmail(data.email)){
    cb(util.getGenericError('Error',400,'Invalid Email.'));
    return;
  }

  School.findOne({where:{or:[{and:[{user_id:data.email,password:data.password}]},{and:[{email_id:data.email,password:data.password}]}]}},function(err,schoolInstance){
  console.log("Not Found");
    if(err){
      cb(util.getGenericError('Error',500,'Internal Server Error!'));
      return;
    }

    if(schoolInstance){
      cb(null,schoolInstance);
    }else {
      cb(util.getGenericError('Error',422,'Invalid email or password!'));
      return;
    }
  });
}




/* --------- Remote method registration ------------*/

School.remoteMethod('registerSchool',{

  description:"Register school ",
  http: {path: '/registerSchool', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
  returns: {
      type: 'string'
    }
});

School.remoteMethod('activateAccount',{

  description:"Activate registered school account ",
  http: {path: '/activateAccount', verb: 'get'},
  accepts: [{arg: 'tokenID', type: 'string', http: { source: 'query' } },
            {arg: 'req', type: 'object', http: { source: 'req' } },
            {arg: 'resp', type: 'object', http: { source: 'res' } }],
   returns: {arg:'resp',type:'object', http: { source: 'res'}},
});

School.remoteMethod('bookDemo',{

  description:"Book a demo for school",
  http: {path: '/bookDemo', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
  returns: {
      type: 'string'
    }
});

School.remoteMethod('loginSchool',{

  description:"School login ",
  http: {path: '/loginSchool', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
  returns: {type: 'object', root:true}

});

};
