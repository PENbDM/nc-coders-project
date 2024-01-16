const {fetchArticles, fetchAllArticles,fetchCommentCount,fetchArticleComments,insertCommentFunction,updateArticleVotes,deleteCommentById} = require('../models/ArtcilesModel')

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

const postCommentForArticleById = (req,res,next)=>{
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
    console.error(err);
    next(err);
  });
}

const patchArticlesByID = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  if (!article_id || isNaN(article_id)) {
    return res.status(400).json({ status: 400, msg: 'Invalid or missing article_id' });
  }
  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(404).json({ status: 404, msg: 'Article not found' });
      }
      res.status(200).json({ article: updatedArticle });
    })
    .catch((err) => {
      res.status(500).json({ status: 500, msg: 'Internal Server Error' });
    });
}
const deleteCommentByIdController = (req, res, next) => {
  const { comment_id } = req.params;
  if (!comment_id || isNaN(comment_id)) {
    return res.status(400).json({ status: 400, msg: 'Invalid or missing comment_id' });
  }
  deleteCommentById(comment_id)
    .then((deletedComment) => {
      if(!deletedComment){
        return res.status(404).json({ status: 404, msg: 'Comment not found' });
      }
      res.status(200).json({ deletedComment });
    })
    .catch((err) => {
      res.status(500).json({ status: 500, msg: 'Internal Server Error' });
    });
};


module.exports ={
    getArticles,getAllArticles,getArticlesByIdAndComments,postCommentForArticleById,patchArticlesByID,deleteCommentByIdController
}