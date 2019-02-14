# GCP/AWS

### Setup Steps

## Github
```
git pull https://github.com/ehlewis/knotter.git
```
fill out credentials

### Pull changes
```
pm2 stop server
git pull
pm2 restart server
```
### Switch branches
```
git checkout dev-beta
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
SERVICE_CONNECTION="remote-sandbox" pm2 start knotter.js
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
