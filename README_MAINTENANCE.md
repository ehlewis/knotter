# Node

## Debugging
```
sudo DEBUG=* node knotter.js
```

## Health Check
From any terminal
```
curl -Ik https://127.0.0.1/api/health_check
curl -Ik https://knotter.co/api/health_check

```

## SSL
(If you're renewing certs, you have to stop NGINX first)
(The domain must be routed to the IP that were doing this on and open to the web, aka not through NGINX, when performing first time setup)

clone certbot
```
git clone https://github.com/certbot/certbot.git
cd certbot
```
then run certbot
```
sudo ./certbot-auto certonly --standalone --email ehlewis@me.com -d knotter.co -d www.knotter.co
```
or if that has issues
```
sudo certbot certonly --standalone --preferred-challenges http -d knotter.co -d www.knotter.co
```
Finally, move the new certs to the directory for NGINX
```
cp cert.pem /etc/letsencrypt/live/knotter.co/
cp privkey.pem /etc/letsencrypt/live/knotter.co/
```

## NGINX
```
sudo apt-get update
sudo apt-get install nginx
sudo services nginx start
```
### Configure reverse proxy paths
Insert the file located in .extras named default into /etc/nginx/sites-available
```
sudo service nginx restart
```
#### Stop NGINX

```
sudo service stop nginx
```
But this doesn't always work, so less gracefully
```
sudo pkill nginx
```

## npm
Install npm
```
sudo apt-get install npm
```
Then install required node packages:
From within /knotter
```
npm install
```

## pm2
```
sudo npm install pm2 -g
```

### To start
Do not run in sudo
```
pm2 start knotter.js
```

### To stop:
```
pm2 stop server
```

If this runs away
```
ps -eo pid,ppid,args | grep node
```
Kill the parent (PID on the right)


## Extras:

#### Redis:
to connect to Redis from GCP vm:
```
telnet 10.0.0.27 6379
```

### Testing
```
npm test
```
to run the test file

# Mongo DB

## Access the mongodb cli
```
mongo
```
### List the users:
```
show dbs
use link
db.users.find().pretty()
```

### Rename an attribute
```
db.users.updateMany({}, {$rename: {"from":"to"}})
```

### Find user with attribute
```
db.users.findOne({items: {$elemMatch: {item_id:'BGGGoMG396SKWdXW1m1ntJ8xm3LzvwfwGnDaX'}}})
```
Returns the user entry with the given item_id

### Remove an entry
```show dbs
use linkDEV
db.users.remove( {"_id": ObjectId("5bc01bd8839da308ed4d817a")});
```

### Drop the db (don't do this unless you have to)
```
use link
db.users.drop()
```

# Redis

## Access the redis cli:
```
redis-cli
```
### View all keys:
```
keys *
```

### Clear keys
```
flushall
```
