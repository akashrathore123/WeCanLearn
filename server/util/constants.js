
function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("HOST_NAME", 'http://localhost:3000');
define("STATIC_PATH", "/home/Saurabh/WeCanLearn")

define("REALM_ANDROID", 'android');
define("REALM_IOS", 'ios');
define("REALM_WEB", 'web');

define("MOBILE_SECRET_TTL", 259200*60000);    // 6 months
define("WEB_SECRET_TTL", 259200*60000);    // 6 months

define("MOBILE_OTP_HIGH", 999999);
define("MOBILE_OTP_LOW", 100001);

define("OTP_TTL", 5*60000);

define("LOGIN_OTP_MESSAGE", "OTP_HERE is your one time password (OTP). Please enter the OTP to proceed.%0AThanks,%0ATeam DayBox");

define("NEW_CLIENT_CONTACT_MSG", "New client request received. Mobile: NUMBER_HERE");

define("NEW_FEEDBACK_MESSAGE", "New feedback is recieved regarding: SUBJECT_HERE.");

define("NEW_FEEDBACK_SUBJECT", "New feedback is recieved regarding: SUBJECT_HERE.");
define("NEW_FEEDBACK_BODY", "New feedback is recieved regarding: SUBJECT_HERE.");
