// app.js
require('dotenv').config();
const express = require('express');

const bodyParser = require('body-parser');

const router = require('./routes');

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
