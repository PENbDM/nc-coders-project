const db = require("../db/connection");

const fetchArticles = (id) => {
    let querySort = `SELECT * FROM articles WHERE article_id = ${id}`;
    return db.query(querySort)
};

const fetchAllArticles = () => {
    let querySort = `SELECT * FROM articles`;
    return db.query(querySort)
};

const fetchCommentCount = (articleId) => {
    const query = `
      SELECT COUNT(*) AS comment_count
      FROM comments
      WHERE article_id = $1
    `;
    return db.query(query, [articleId])
      .then(result => result.rows[0].comment_count);
  };
  
module.exports = {
    fetchArticles,fetchAllArticles,fetchCommentCount
}