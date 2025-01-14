const express = require('express');
const routes = require('./routes/v1');


const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// v1 api routes
app.use('/v1', routes);

app.get("/", (req, res) => res.send("Congratulation 🎉🎉! Our Express server is Running on Vercel with restruct"));

module.exports = app;