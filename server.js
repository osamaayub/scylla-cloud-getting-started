const cassandra = require('cassandra-driver');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const cql = require('./cql');
require('dotenv').config();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

const { NODE_IP, DATA_CENTER, USERNAME, PASSWORD } = process.env;
const client = new cassandra.Client({
    contactPoints: [NODE_IP],
    localDataCenter: DATA_CENTER,
    credentials: { username: USERNAME, password: PASSWORD },
});

const execute = (query, params) => {
    return client.execute(query, params, { prepare: true });
};
const migrate = async () => {
    await execute(cql.KEYSPACE);
    for (const query of cql.MIGRATE) {
        console.log(`query = ${query}`);
        await client.execute(query);
    }
};

migrate();

app.get('/get-all-items', async (_, res, next) => {
    try {
        const query = 'SELECT * FROM todos.items';
        const result = await execute(query);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
});

app.post('/create-item', async (req, res, next) => {
    try {
        const { name } = req.body;
        const itemId = cassandra.types.Uuid.random();
        const query =
            'INSERT INTO todos.items(id, name, completed) VALUES (?, ?, ?)';
        await execute(query, [itemId, name, false]);
        res.status(200).send({ itemId });
    } catch (err) {
        next(err);
    }
});

app.put('/update-item/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const query = 'UPDATE todos.items SET completed=? WHERE id=?';
        await execute(query, [completed, id]);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
});

// Delete item
app.delete('/delete-item/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM todos.items WHERE id=?';
        await execute(query, [id]);
        res.status(200).send();
    } catch (err) {
        next(err);
    }
});

app.listen(4242, () => console.log(`Running on port 4242`));
