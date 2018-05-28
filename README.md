### Link

Run the following commands to start the website
```
mongod

APP_PORT=8000 PLAID_CLIENT_ID=5ac8108bbdc6a40eb40cb093 PLAID_SECRET=786c67f3c3dd820f2bf7dd37ec5bb1 PLAID_PUBLIC_KEY=201d391154bbd55ef3725c4e6baed3 PLAID_ENV=sandbox node server.js

# Go to http://localhost:8000

mongo
db.users.find().pretty();
```
