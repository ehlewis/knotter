# Link

Run the following commands to start the website on localhost in sandbox mode

## Install Node version
We have to use a v8.x.x version due to breaking changes in v10.x.x, so we must force our computer to have the correct runtime
```
npm install -g n   # Install n globally
n 8.14.1          # Install and use v0.10.33
```
Then this will globally switch our node version to the version specified (8.14.1, latest 8.x.x version and LTS)

## Install dependencies
(From inside /link)
```
npm install
```

## Start the db
```
mongod --bind_ip 127.0.0.1
```

## Start the Redis Cache
(From inside /knotter)
```
redis-server redis.conf
```

## Start the web server
```
sudo SERVICE_CONNECTION="local-sandbox" node knotter.js
```

#### Go to 127.0.0.1
