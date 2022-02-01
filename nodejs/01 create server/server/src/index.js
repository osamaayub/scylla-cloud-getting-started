const express = require('express');
const api = require('./api');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Scylla',
    });
});

app.use(bodyParser.json());
app.use(cors());

app.use('/api', api);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
