# Link

Run the following commands to start the website on localhost in sandbox mode

## Install Node version
We have to use a v8.x.x version due to breaking changes in v10.x.x, so we must force our computer to have the correct runtime
```npm install -g n   # Install n globally
n 8.14.1          # Install and use v0.10.33
```
Then this will globally switch our node version to the version specified (8.14.1, latest 8.x.x version and LTS)
## Install dependencies
From inside /link
```
npm install
```

## Start the db
```
mongod --bind_ip 127.0.0.1
```
To access the mongodb cli: ```mongo```
To list the users we have in the db from the cli:
```
show dbs
use link
db.users.find().pretty()
```

To rename an attribute
```
db.users.updateMany({}, {$rename: {"from":"to"}})
```

To remove and entry
```show dbs
use linkDEV
db.users.remove( {"_id": ObjectId("5bc01bd8839da308ed4d817a")});
```

To drop the db (don't do this unless you have to)
```
use link
db.users.drop()
```

## Start the Redis Cache
from the web-app server file
```
redis-server redis.conf
```

To access the redis cli: ```redis-cli```
To view all keys in the redis cache from the cli: ```keys *```

## Start the web server
```
sudo SERVICE_CONNECTION="local-sandbox" node knotter.js
```

#### Go to 127.0.0.1

## Extras

### Debugging
```
sudo DEBUG=* node knotter.js
```

### Health Check
```
curl -Ik https://127.0.0.1/api/health_check
```
