require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('open', async () => {
    console.log('Database Connected');
});
const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());

const routes = require('./routes/routes');

app.use('/api', routes)

app.listen(3000, () => {
    console.log(`Server Started at ${3000}`)
})
