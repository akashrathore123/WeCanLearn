var util = require("../util");
var validate = require("../util/validation");
var mail = require("../util/mailer");
var uuid = require("node-uuid");
var constant = require("../util/constants");
var path = require('path');
var loopback = require('loopback');

module.exports = function(School) {

School.registerSchool = function(data,cb){

  console.log(data);
  if(!data.name || !data.address || !data.city || !data.password || !data.phone || !data.email){

    cb(util.getGenericError("Error",422,"Invalid data received."));
    return;
       }

   if(!validate.isSchoolName(data.name)){
        cb(util.getGenericError("Error",400,"Invalid School Name."));
        return;
   }

   if(!validate.isName(data.city)){
        cb(util.getGenericError("Error",400,"Invalid School Name."));
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
        cb(util.getGenericError("Error",400,"Bad Request-Email already exist"));
        return;
        }
     else{

 var uuid5 = uuid.v4();
 var currentTime = new Date();
 var registerData = {
                      "user_id": data.user_id,
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
    console.log(html_body);
    School.create(registerData,function(err){
               if(err){
                            console.log(err);
                            cb(util.getGenericError("Error",500, "Registration could not complete."));
                            return;
                        }
               else{

                           mail.send(data.email,"Account Verification",html_body);
                           cb(null,"Registered Successfully.");
                           return;
                      }
          });
 }

 });
}

School.activateAccount = function(tokenID,cb){
console.log("cg"+tokenID);

}

School.bookDemo = function(data,cb){
  if(!data.name || !data.phone || !data.email || !data.message){
        cb(util.getGenericError("Error",422,"Incomplete Data."))
        return;
    }
    else{
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
  accepts: {arg: 'tokenID', type: 'string', http: { source: 'query' } },

});

School.remoteMethod('bookDemo',{

  description:"Book a demo for school",
  http: {path: '/bookDemo', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
  returns: {
      type: 'string'
    }
});
};
