export DATABASE_URL=postgres://postgres:postgres@localhost:5433/swipes
export ASANA_CLIENT_ID=55104337606444
export ASANA_CLIENT_SECRET=ef862c7ddea4a517d61e5c345812e9eb
export ASANA_REDIRECT_URL=http://localhost:5000/v1/asana/asana_oauth
export ORIGIN=http://localhost:9000
#node api/instance.js
node rest/instance.js
