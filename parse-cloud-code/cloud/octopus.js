exports.subscribe = function(listId, email, firstName, lastName, callback){
    var url = 'https://emailoctopus.com/api/1.1/lists/' + listId + '/contacts';
    var conf = require('cloud/conf.js');
    var keys = conf.keys;

    var params = {
        "api_key":keys.octopusToken,
        "email_address":email
    };
    if(typeof firstName === "function"){
        callback = firstName;
        firstName = null;
    }
    if(typeof lastName === "function"){
        callback = lastName;
        lastName = null;
    }
    if(firstName){
        params["first_name"] = firstName;
    }
    if(lastName){
        params["last_name"] = lastName;
    }
    Parse.Cloud.httpRequest({
        url:url,
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: params,
        success:function(result){
            if(callback) callback(result);
        },
        error:function(error){
            if(callback) callback(false,error);
        }
    });
}
