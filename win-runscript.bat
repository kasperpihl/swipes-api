@echo off

set DB_HOST=192.168.1.100
set ORIGIN=http://localhost:9000
set TEAM_ID=TSMFYIEKK
nodemon --harmony_rest_parameters rest/instance.js
