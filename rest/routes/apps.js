"use strict";

let express = require( 'express' );
let router = express.Router();
let fs = require("fs");
let subdirs = require('subdirs');
 

router.get('/app.list', (req, res, next) => {
  subdirs(__dirname + "/../../apps/", function(err, dirs) {
    console.log(dirs); // all of your subdirs are in here!
    for(var i = 0 ; i < dirs.length ; i++){
      var dir = dirs[i];
      var split = dir.split("/");
      var appName = split[split.length - 1];
      if(appName == "app-loader")
        continue;
      console.log(i, dir);
      try{
        var obj = JSON.parse(fs.readFileSync(dir+"/manifest.json", 'utf8'));
        console.log(obj);
      }
      catch(e){
        console.log(e);
      }
    }
    res.send("yeah");
  })
});


router.post('/apps.activate', (req, res, next) => {

});


router.post('/apps.deactivate', (req, res, next) => {
  
});


router.post('/apps.delete', (req, res, next) => {

});


router.post('/apps.load', (req, res, next) => {
  
});


module.exports = router;
