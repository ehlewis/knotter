# GCP

## Setup

### NGINX
```
sudo apt-get update
sudo apt-get install nginx
sudo services nginx start
```
#### Configure reverse proxy paths
Insert the file located in .extras named default into /etc/nginx/sites-available
```
sudo services nginx restart
```

### pm2
```
sudo apt-get install pm2
```

### To start
Do not run in sudo
```
SERVICE_CONNECTION="remote-staging" pm2 server.js
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

### Pull changes
```
pm2 stop server
git pull
pm2 restart server
```


## Extras:

#### Redis:
to connect to Redis from the gcp vm:
```
telnet 10.0.0.27 6379
```

### Testing
```npm test
```
to run the test file
