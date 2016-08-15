//var error = require("error");

module.exports = {

  getGenericError:function(type,code,message){
var error = new Error();
error.status = code;
error.message = message;
  return error;
  }}
