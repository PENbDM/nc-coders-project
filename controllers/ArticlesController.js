const {fetchArticles, fetchAllArticles,fetchCommentCount,fetchArticleComments,insertCommentFunction} = require('../models/ArtcilesModel')

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
        console.error(err);
        next(err);
      });
};



const getAllArticles = (req, res, next) => {
    fetchAllArticles()
      .then((articles) => {
        const promises = articles.rows.map((article) => {
          return fetchCommentCount(article.article_id)
            .then((commentCount) => {
              return {
                ...article,
                comment_count: commentCount,
              };
            });
        });
  
        return Promise.all(promises);
      })
      .then((articlesWithCommentCount) => {
        const sortedArticles = articlesWithCommentCount.sort((a, b) => b.created_at - a.created_at);
        const formattedArticles = sortedArticles.map(({ body, ...rest }) => rest); 
        res.status(200).json(formattedArticles);
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
};
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
    .then((comment) => {
      res.status(201).json(comment);
    })
    .catch((err) => {
      if (err.message === 'Username not found') {
        return res.status(404).json({ error: err.message });
      }
      console.error(err);
      next(err);
    });
};



module.exports ={
    getArticles,getAllArticles,getArticlesByIdAndComments,postCommentForArticleById
}