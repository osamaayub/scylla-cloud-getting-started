const express = require('express');
const todos = require('./items');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to API',
    });
});

router.use('/items', todos);

module.exports = router;
