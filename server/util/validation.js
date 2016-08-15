var validator = require('./validation');
var constants = require("./constants");

module.exports = {


	isEmptyObject : function(obj){
		return !Object.keys(obj).length;
	},


	isPhone: function(mobile){
		var re = /^[789]\d{9}$/;
		return re.test(mobile);
	},


	isRealm : function(realm){
		return (realm == constants.REALM_ANDROID || realm == constants.REALM_WEB || realm == constants.REALM_IOS);
	},

	isSchoolName:function(name){

			var re = /^[A-Za-z_.'-, ]{2,200}$/;

			return re.test(name);
		},

	isName:function(name){

	 		var re = /^[A-Za-z_. ]{2,100}$/;

	 		return re.test(name);
	 	},

	isEmail : function(email){
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}


}
