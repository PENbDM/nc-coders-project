const express = require("express");
const {getTopics,getApi} = require('./controllers/TopicsControllers')
const {getArticles, getAllArticles} = require('./controllers/ArticlesController')
const app = express();
app.use(express.json());


app.get('/api/topics',getTopics)
app.get('/api',getApi)
app.get('/api/articles/:article_id',getArticles)
app.get('/api/articles',getAllArticles)
module.exports = app;
