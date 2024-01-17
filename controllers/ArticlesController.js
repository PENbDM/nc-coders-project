const {fetchArticles, fetchAllArticles,fetchCommentCount,fetchArticleComments,insertCommentFunction,updateArticleVotes,fetchArticlesByTopic} = require('../models/ArtcilesModel')


const getArticles = (req, res, next) => {
    const {article_id} = req.params;
    if (!article_id || isNaN(article_id)) {
        return res.status(400).json({ error: 'Invalid or missing article_id' });
      }
      fetchArticles(article_id)
      .then((articles) => {
        if (articles.rows.length === 0) {
          return res.status(404).json({ error: 'Article not found' });
        }
          res.status(200).json(articles.rows);
      })
      .catch((err) => {


const getArticlesByIdAndComments = (req, res, next) => {
  const { article_id } = req.params;

  if (!article_id || isNaN(article_id)) {
    return res.status(400).json({ error: 'Invalid or missing article_id' });
  }

  fetchArticleComments(article_id)
    .then((comments) => {
      if (comments.length === 0) {
        return res.status(404).json({ error: 'Article not found' });
      }else{
        const sortedComments = comments.sort((a, b) => b.created_at - a.created_at);
        res.status(200).json(sortedComments);
      }
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const postCommentForArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  if (!article_id || isNaN(article_id)) {
    return res.status(400).json({ error: 'Invalid or missing article_id' });
  }
  if (!username || !body) {
    return res.status(400).json({ error: 'Username and body are required in the request body' });
  }
  insertCommentFunction(article_id, username, body)





module.exports ={
    getArticles,getAllArticles,getArticlesByIdAndComments,postCommentForArticleById,patchArticlesByID,deleteCommentByIdController
}