const express = require('express');

const router = express.Router();

const items = [{ id: '1', name: 'hello', completed: false }];
// const items = [];

router.get('/', (req, res) => {
    res.status(200).json(items);
});

router.post('/', (req, res) => {
    console.log(req.body);
    res.status(200).json({ message: 'todos was added' });
});

module.exports = router;
