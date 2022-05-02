# Getting started with Scylla Cloud

The project is designed to quickly get you started with building a CRUD app and connect it to Scylla Cloud.

To get started, you can create a cluster on Scylla Cloud, create a keyspace, a table and insert values.

## TODO app

The project is structured by languages

## Creating a Scylla Cloud account

Create a free-trial account on [Scylla Cloud](scylladb.com/cloud).

## Creating a cluster

On [Scylla Cloud](https://cloud.scylladb.com/), navigate to the `My Clusters` page and click on `Create New Cluster` card.
Enter the cluster's name (`todo-cluster` for example) and scroll down and click on `Launch Cluster`.

## Connect to the cluster using docker and cqlsh

On your cluster's information page, locate your username, passowrd and node IP addresses.
Run the below command for connect to your cluster.

`docker run -it --rm --entrypoint cqlsh scylladb/scylla -u [USERNAME] -p [PASSWORD] [NODE IP]`

Run the following CQL command to test the connection
`DESCRIBE KEYSPACES;`

## Create a keyspace and a table

Run the following commands to create a keyspace, a table and insert values.

```
CREATE KEYSPACE todos WITH replication = {'class': 'NetworkTopologyStrategy', 'AWS_US_EAST_1' : 3} AND durable_writes = true;
USE todos;
CREATE TABLE items ( id uuid PRIMARY KEY, name text, completed boolean);
INSERT INTO items (id, name, completed) VALUES (uuid(), 'Create Scylla Cloud account',false);
INSERT INTO items (id, name, completed) VALUES (uuid(), 'Create API project',false);
INSERT INTO items (id, name, completed) VALUES (uuid(), 'Connect API to Scylla Cloud',false);
INSERT INTO items (id, name, completed) VALUES (uuid(), 'Add CRUD operations',false);
INSERT INTO items (id, name, completed) VALUES (uuid(), 'Complete Scylla University',false);
```

then run `SELECT * FROM items;` to make sure everything was properly inserted.

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

# Client app

The client app is implemented with ReactJS and uses `axios` to send HTTP requests to the server app.

![alt text](https://github.com/raoufchebri/getting-started/blob/master/.img/todo-react-demo.gif?raw=true)

## Getting started

Install the project dependencines using the following command:
`npm install`

Run the application using `npm start`.

You will first need to [implement the backend](../server/nodejs/README.md).

## Using the starter project

Install `axios` using the following command:
`npm i axios `

In the components/TodoList.js file, import axios then locate the onCreateItem function and add the following code inside the useCallback hook:

### Create

```
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

const TodoList = () => {
   const [items, setItems] = useState([]);

   const onItemCreate = useCallback(
       (newItem) => {
           axios.post(`${BASE_URL}/items`, newItem).then((res) => {
               setItems([...items, { ...newItem, id: res.itemId }]);
           });
       },
       [items]
   );
//...

```

### Read

In the TodoList.js component, add the following code:

```
import React, { useState, useCallback, useEffect } from 'react';
// ...
const TodoList = () => {
   // ...
   useEffect(() => {
       axios.get(BASE_URL).then((res) => setItems(res.data));
   }, []);

```

### Update

In the client application, in The TodoList.js component, locate the onItemUpdate function and replace it with the following code:

```
const onItemUpdate = useCallback(
       (item) => {
           axios
               .put(`${BASE_URL}/${item.id}`, { completed: item.completed })
               .then(() => {
                   const index = items.findIndex((i) => i.id === item.id);
                   setItems([
                       ...items.slice(0, index),
                       item,
                       ...items.slice(index + 1),
                   ]);
               });
       },
       [items]
   );

```

### Delete

In the TodoList component in the client project, locate the onItemDelete function and replace it with the following:

```
const onItemDelete = useCallback(
       (item) => {
           axios.delete(`${BASE_URL}/${item.id}`).then(() => {
               const index = items.findIndex((i) => i.id === item.id);
               setItems([...items.slice(0, index), ...items.slice(index + 1)]);
           });
       },
       [items]
   );

```
