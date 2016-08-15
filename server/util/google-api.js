var refresh = require('google-refresh-token');


var mailConfig = {
    email:"help@wecanlearn.in",
    refreshToken: "1/f5VYdYFx-1Azi1pcn9QJi9plg27YXdLeg4mo-yAD0Dc",
    clientid: "117469800089-a711vs4bf8e5bl2uur7se5242vdlbam0.apps.googleusercontent.com",
    clientSecret: "v1TjqmumpbP12nJ5MjNNhZOa"
}
module.exports = {
    getCredentials : function(cb){
        refresh(mailConfig.refreshToken, mailConfig.clientid, mailConfig.clientSecret, function (err, json, res) {
            if(!err){
                mailConfig.accessToken = json.accessToken;
                cb(mailConfig)
            }
        });
    }
}
