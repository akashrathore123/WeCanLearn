var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var gapis = require("./google-api");
var fs = require('fs');
var mailConfig = {
    "email":"help@wecanlearn.in",
    "refresh_token": "1/f5VYdYFx-1Azi1pcn9QJi9plg27YXdLeg4mo-yAD0Dc",
    "client_id": "117469800089-a711vs4bf8e5bl2uur7se5242vdlbam0.apps.googleusercontent.com",
    "client_secret": "v1TjqmumpbP12nJ5MjNNhZOa"
}

var transporter;
gapis.getCredentials(function(tokens){
    mailConfig.access_token = tokens.accessToken;
    // login
transporter = nodemailer.createTransport("SMTP",{
  service: 'gmail',
  auth: {
      XOAuth2: {
          user: mailConfig.email,
          clientid: mailConfig.client_id,
          clientSecret: mailConfig.client_secret,
          refreshToken: mailConfig.refresh_token,
          accessToken: mailConfig.access_token
      }
  }
});

});



module.exports = {
    send: function(to, subject, body, files){
      console.log("sending");
        var mailData = {
            from: 'WeCanLearn <help@wecanlearn.in>',
            to: to,
            subject: subject,
            html: body,
            attachments: []
        }
        if(files && files.length > 0){
            files.forEach(function(file){
                mailData.attachments.push({
                    filename: file.fileName,
                    contents: file.content,
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
            });
        }
        console.log(mailData);
        transporter.sendMail(mailData, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent');
            }
        });
    }
}
