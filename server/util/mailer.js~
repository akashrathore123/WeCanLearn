var nodemailer = require('nodemailer');
var gapis = require("./google-api");
var fs = require('fs');
var mailConfig = {
    "email":"contact@daybox.in",
    "refresh_token": "1/50r51AqZPDumLeiCZ1Um5B4Omi82DCF-pqbuA2IZVUEMEudVrK5jSpoR30zcRFq6",
    "client_id": "511024988743-bigi3s2fub88j6ciok8m8mbk4kedr2iq.apps.googleusercontent.com",
    "client_secret": "Eof_w_hi4s4UfgEdJl9yIKQ-"
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
        var mailData = {
            from: 'DayBox <contact@daybox.in>',
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
