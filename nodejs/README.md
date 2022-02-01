# Getting Started

This project walks you through the steps to create a Todo app using NodeJS, ReactJS and ExpressJS.

The project was designed in three steps:
- 00 starter: contains a ReactJS front-end app.
- 01 create server: add an ExpressJS server app and connect it to the front-end app.
- 02 connect to cluster: connect the server app to Scylla Cloud using cassandra-driver fron NodeJS.

Each folder contains a client and server projects.

## Client App

In the `client` project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Server App

In the `server` directory, you can run:

### `npm run dev`

### Test the API

### `curl -v http://localhost:3001/api/items`

You can open [http://localhost:3001/api/items](http://localhost:3001/api/items) to test the API in your browser.