# Before you run this script install pm2 module
# sudo npm install -g pm2
# Amazon database
# export SW_DATABASE_HOST=52.0.154.56
cd rest
pm2-dev start swipes.json
