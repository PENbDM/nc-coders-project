const express = require("express");
const {getTopics} = require('./controllers/TopicsControllers')
const app = express();
app.use(express.json());


app.get('/api/topics',getTopics)



module.exports = app;
