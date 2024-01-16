const express = require("express");
const {getTopics,getApi} = require('./controllers/TopicsControllers')
const {getArticles, getAllArticles,getArticlesByIdAndComments,postCommentForArticleById} = require('./controllers/ArticlesController')
const app = express();
app.use(express.json());


app.get('/api/topics',getTopics)
app.get('/api',getApi)
app.get('/api/articles/:article_id',getArticles)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getArticlesByIdAndComments)
app.post('/api/articles/:article_id/comments',postCommentForArticleById)
module.exports = app;
