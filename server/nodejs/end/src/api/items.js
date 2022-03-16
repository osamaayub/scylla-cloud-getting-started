const express = require('express');
const cassandra = require('cassandra-driver');
const { getClientWithKeyspace } = require('../db');

const cluster = getClientWithKeyspace();

const router = express.Router();

// Create one item
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
});

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

// Update item
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

// Delete item
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

module.exports = router;
