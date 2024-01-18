const {fetchArticlesById,fetchAllArticles,fetchArticlesByTopic,fetchCommentCount,fetchArticleComments,insertCommentFunction,updateArticleVotes,deleteCommentById} = require('../models/articlesModel')
const {getUserByUsername} = require('../models/userModel')
const getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).json({ error: "Invalid article_id" });
  }

  fetchArticlesById(article_id)
    .then((article) => {
      if (article.length === 0) {
        return res.status(404).json({ error: "Article not found" });
      }

      const [singleArticle] = article;

      return fetchCommentCount(article_id).then((commentCount) => {
        const articleWithCommentCount = {
          ...singleArticle,
          comment_count: commentCount,
        };

        res.status(200).json(articleWithCommentCount);
      });
    })
    .catch((error) => {
      next(error);
    });
};


  const getAllArticles = (req, res, next) => {
    const { topic } = req.query;
    if (topic) {
      fetchArticlesByTopic(topic).then((article) => {
        if (article.rows.length === 0) {
          return res
            .status(404)
            .json({ error: `Article with ${topic} topic not found` });
        }
        res.status(200).json(article.rows);
      });
    } else {
      fetchAllArticles()
        .then((articles) => {
          const promises = articles.rows.map((article) => {
            return fetchCommentCount(article.article_id).then((commentCount) => {
              return {
                ...article,
                comment_count: commentCount,
              };
            });
          });
  
          return Promise.all(promises);
        })
        .then((articlesWithCommentCount) => {
          const sortedArticles = articlesWithCommentCount.sort(
            (a, b) => b.created_at - a.created_at
          );
          const formattedArticles = sortedArticles.map(
            ({ body, ...rest }) => rest
          );
          res.status(200).json(formattedArticles);
        })
        .catch((err) => {
          next(err);
        });
    }
  };


  const getArticlesByIdAndComments = (req, res, next) => {
    const { article_id } = req.params;
  
    if (isNaN(article_id)) {
      return res.status(400).json({ error: "Invalid article_id" });
    }
    fetchArticleComments(article_id)
      .then((comments) => {
        if (comments.length === 0) {
          return res.status(404).json({ error: "Article not found" });
        } else {
          const sortedComments = comments.sort(
            (a, b) => b.created_at - a.created_at
          );
          res.status(200).json(sortedComments);
        }
      })
      .catch((err) => {
        next(err);
      });
  };



  const postCommentForArticleById = async (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    try {
      if(!username || !body) {
        return res.status(400).json({error:'Missing username or body'})
      }
      if (isNaN(article_id)) {
        return res.status(400).json({ error: "Invalid article_id" });
      }
      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(400).json({ error: "User with the provided username does not exist" });
      }
      const articleExists = await fetchArticlesById(article_id)
        .then((articles) => articles.length > 0)
        .catch(() => false);
      if (!articleExists) {
        return res.status(404).json({ error: `Article with id ${article_id} does not exist` });
      }
      const comment = await insertCommentFunction(article_id, user.username, body);
      res.status(201).json(comment);
    } catch (err) {
      next(err);
    }
  };

  const patchArticlesByID = (req, res, next) => {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    if (isNaN(article_id)) {
      return res
        .status(400)
        .json({ msg: "Missing article_id" });
    }
    if (!inc_votes || isNaN(inc_votes)) {
      return res
        .status(400)
        .json({ msg: "Invalid or missing inc_votes" });
    }
    updateArticleVotes(article_id, inc_votes)
      .then((updatedArticle) => {
        if (!updatedArticle) {
          return res.status(404).json({msg: "Article not found" });
        }
        res.status(200).json({ article: updatedArticle });
      })
      .catch((err) => {
        res.status(500).json({ msg: "Internal Server Error" });
      });
  };


  const deleteCommentByIdController = (req, res, next) => {
    const { comment_id } = req.params;
    if (!comment_id || isNaN(comment_id)) {
      return res
        .status(400)
        .json({ status: 400, msg: "Invalid or missing comment_id" });
    }
    deleteCommentById(comment_id)
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ status: 404, msg: "Comment not found" });
        }
        res.status(204).json();
      })
      .catch((err) => {
        res.status(500).json({ status: 500, msg: "Internal Server Error" });
      });
  };
  

  module.exports = {
    getArticlesById,getAllArticles,getArticlesByIdAndComments,postCommentForArticleById,patchArticlesByID,deleteCommentByIdController
  }