const express = require('express');

const router = express.Router();

const items = [
    { id: '1', name: 'Buy groceries', completed: false }, 
    { id: '2', name: 'Clean the car', completed: true },
    { id: '3', name: 'Walk the dog', completed: false }
];

router.get('/', (req, res) => {
    res.status(200).json(items);
});

router.post('/', (req, res) => {
    res.status(200).json({ message: 'todos was added' });
});

router.put('/:id', (req, res) => {
    const item = items.find(item => item.id === req.params.id)
    res.status(200).json({ message: 'todos was updated', item });
});

router.delete('/:id', (req, res) => {
    const index = items.findIndex(item => item.id === req.params.id);
    items.splice(index, 1)
    res.status(200).json({ message: `item ${req.params.id} was deleted` });
});

module.exports = router;
