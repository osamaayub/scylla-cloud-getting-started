const express = require('express');

const router = express.Router();

const items = [
    { id: '1', name: 'Buy groceries', completed: false },
    { id: '2', name: 'Clean the car', completed: true },
    { id: '3', name: 'Walk the dog', completed: false },
];

router.get('/', (req, res) => {
    res.status(200).json(items);
});

// CREATE Item
router.post('/', (req, res) => {
    const { item } = req.body;
    items.push(item);
    console.log('Item added');
    res.status(200).send();
});

//UPDATE Item
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { item } = req.body;
    const index = items.findIndex((i) => i.id === id);
    items = [...items.slice(0, index), item, ...items.slice(index + 1)];
    res.status(200).send();
});

// DELETE Item
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = items.findIndex((i) => i.id === id);
    items = [...items.slice(0, index), ...items.slice(index + 1)];
    res.status(200).send();
});

module.exports = router;
