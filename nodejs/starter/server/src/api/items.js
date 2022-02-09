const express = require('express');
const cassandra = require('cassandra-driver');
require('dotenv').config();

const { NODE_IP, DATA_CENTER, USERNAME, PASSWORD, ITEMS_KEYSPACE } =
    process.env;

const cluster = new cassandra.Client({
    contactPoints: [NODE_IP],
    localDataCenter: DATA_CENTER,
    credentials: { username: USERNAME, password: PASSWORD },
    keyspace: ITEMS_KEYSPACE,
});

const router = express.Router();

// Create one item
router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        const itemId = cassandra.types.Uuid.random();
        const query = 'INSERT INTO items(id, name, completed) VALUES (?, ?, ?)';
        const result = await cluster.execute(query, [itemId, name, false]);
        res.status(200).send({ itemId, result });
    } catch (err) {
        next(err);
    }
});

// Get all items
router.get('/', async (_, res, next) => {
    try {
        const query = 'SELECT * FROM items';
        const result = await cluster.execute(query);
        res.json({ items: result.rows });
    } catch (err) {
        next(err);
    }
});

// Delete item
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM items WHERE id=?';
        const result = await cluster.execute(query, [id]);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

// Update item
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const query = 'UPDATE items SET completed=? WHERE id=?';
        const result = await cluster.execute(query, [completed, id]);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
