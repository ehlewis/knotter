# Link

Run the following commands to start the website

## Start the db
```
mongod --bind_ip 127.0.0.1
```
To access the mongodb cli: ```mongo```
To list the users we have in the db from the cli: ```db.users.find().pretty()```

## Start the Redis Cache
```
brew services start redis
```

To access the redis cli: ```redis-cli```
To view all keys in the redis cache from the cli: ```keys *```

## Start the web server
```node server.js```

#### Go to http://localhost:8080
