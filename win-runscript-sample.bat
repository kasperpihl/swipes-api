REM Before you run this script install pm2 module
REM sudo npm install -g pm2
REM Amazon database
set SW_DATABASE_HOST=52.23.188.131
set SW_DATABASE_PORT=28019
cd rest
pm2-dev start swipes.json
