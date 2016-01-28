REM Before you run this script install pm2 module
REM sudo npm install -g pm2
REM Amazon database
REM set SW_DATABASE_HOST=52.0.154.56
cd rest
pm2-dev start swipes.json
