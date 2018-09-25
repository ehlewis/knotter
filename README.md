# Link

Run the following commands to start the website

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
from the web-app server file
```sudo node server.js```

#### Go to 127.0.0.1

## Testing
```npm test``` to run the test file
