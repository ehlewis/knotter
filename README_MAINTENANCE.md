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
