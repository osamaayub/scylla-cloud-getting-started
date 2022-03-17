# Server app

This project walks you through the steps to create a backend service for a Todo app using NodeJS and ExpressJS.

## Getting started

Follow the instructions to [create a cluster on Scylla Cloud](../README.md).
Add your cluster's information on `.env` file. Below is an example:

```
USERNAME="scylla"
PASSWORD="*************"
DATA_CENTER="AWS_EAST_1"
NODE_IP="235.109.32.27"
KEYSPACE="todos"
```

In the project folder, run the following command to install project dependencies:
`npm install`

Run `npm run dev` to start the app.
`Listening to http://localhost:3001 🚀 🚀 🚀 `

## Test the API

Open http://localhost:3001 on your browser, and you should see the following message:

```
{
"message": "Welcome to Scylla 😉"
}
```

http://localhost:3001/api should return the following object:

```
{
"message": "Welcome to API 🚀"
}
```

### using curl

Run the following command:

`curl -v http://localhost:3001/api/items`

You can open [http://localhost:3001/api/items](http://localhost:3001/api/items) to test the API in your browser.

```
*   Trying ::1:3001...
* Connected to localhost (::1) port 3001 (#0)
> GET /api/items HTTP/1.1
> Host: localhost:3001
> User-Agent: curl/7.77.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 26
< ETag: W/"1a-wtLtpakh/aHZijHym0cXyb81o1k"
< Date: Mon, 14 Feb 2022 10:22:12 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
{"message":"Get all item"}
```

### Using Postman

At each step of implementing the CRUD operations, you can test the API using [Postman](https://www.postman.com/downloads/).

### Implmenting the app

## Connect to Scylla Cloud cluster

In `items.js` file, import the cassandra-driver and the dotenv config like so:

```
const cassandra = require('cassandra-driver');
require('dotenv').config();
```

Add environemtn variables and cretae a cassandra.Client instance .

```
const { NODE_IP, DATA_CENTER, USERNAME, PASSWORD, ITEMS_KEYSPACE } =
   process.env;

const cluster = new cassandra.Client({
   contactPoints: [NODE_IP],
   localDataCenter: DATA_CENTER,
   credentials: { username: USERNAME, password: PASSWORD },
   keyspace: KEYSPACE,
});
```

## Implement CRUD operations

### Create

Replace the router.post middleware in `api/items.js` with the following code:

```
router.post('/', async (req, res, next) => {
   try {
       const { name } = req.body;
       const itemId = cassandra.types.Uuid.random();
       const query = 'INSERT INTO items(id, name, completed) VALUES (?, ?, ?)';
       await cluster.execute(query, [itemId, name, false]);
       res.status(200).send({ itemId });
   } catch (err) {
       next(err);
   }
```

### Read

In `api/items.js` file, locate the `router.get` middleware and replace it with the following code:

```
// Get all items
router.get('/', async (_, res, next) => {
   try {
       const query = 'SELECT * FROM items';
       const result = await cluster.execute(query);
       res.json(result.rows);
   } catch (err) {
       next(err);
   }
});
```

### Update

Locate the `items.js` file and update the put middleware with the following:

```
router.put('/:id', async (req, res, next) => {
   try {
       const { id } = req.params;
       const { completed } = req.body;
       const query = 'UPDATE items SET completed=? WHERE id=?';
       await cluster.execute(query, [completed, id]);
       res.status(200).send();
   } catch (err) {
       next(err);
   }
});

```

In`items.js` file, replace the delete middleware with following code:

### Delete

```
router.delete('/:id', async (req, res, next) => {
   try {
       const { id } = req.params;
       const query = 'DELETE FROM items WHERE id=?';
       await cluster.execute(query, [id]);
       res.status(200).send();
   } catch (err) {
       next(err);
   }
});
```
