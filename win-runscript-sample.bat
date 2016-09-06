REM Before you run this script install pm2 module
REM sudo npm install -g pm2
REM Azure database
set SW_DATABASE_HOST=rethinkdb-staging6110.cloudapp.net
cd rest
pm2-dev start swipes.json
