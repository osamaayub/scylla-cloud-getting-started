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
