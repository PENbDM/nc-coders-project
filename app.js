const express = require("express");
const cors = require('cors');
const {getTopics} = require('./controllers/TopicsController')
const {getApi} = require('./controllers/ApiController')
const {getArticlesById,getAllArticles,getArticlesByIdAndComments,postCommentForArticleById,patchArticlesByID,deleteCommentByIdController} = require('./controllers/ArticlesController')
const {getUsers, getUserByName, createUserController} = require('./controllers/UserController')

const app = express();
app.use(express.json());


app.use(cors());

app.get('/api/topics',getTopics)
app.get('/api',getApi)
app.get('/api/articles/:article_id',getArticlesById)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getArticlesByIdAndComments)
app.post('/api/articles/:article_id/comments',postCommentForArticleById)
app.patch('/api/articles/:article_id',patchArticlesByID)
app.delete('/api/comments/:comment_id',deleteCommentByIdController)

app.get('/api/users',getUsers)
app.get('/api/users/:username',getUserByName)
app.post('/api/users/',createUserController)
app.use((err, req, res, next) => {
    if (err.message === "Invalid article_id") {
      return res.status(400).json({ error: err.message });
    } else if (err.message === "Article not found") {
      return res.status(404).json({ error: err.message });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  });


module.exports = app;