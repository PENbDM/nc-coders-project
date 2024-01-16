const {fetchArticles} = require('../models/ArtcilesModel')

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
        next(err);
      });
  };




module.exports ={
    getArticles,
}