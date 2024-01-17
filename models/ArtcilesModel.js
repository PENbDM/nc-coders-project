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
  const fetchArticleComments = (articleId) => {
    const query = `
      SELECT *
      FROM comments
      WHERE article_id = $1
    `;
  
    return db.query(query, [articleId])
      .then((result) => result.rows);
  };
  const insertCommentFunction = (article_id, username, body) => {
    const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
    if (!username) {
      return Promise.reject(new Error('Invalid username'));
    }
    
    return db.query(checkUserQuery, [username])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject(new Error('Username not found'));
        }
        const user = result.rows[0];
        const query = `
          INSERT INTO comments (article_id, author, body, votes, created_at)
          VALUES ($1, $2, $3, $4, NOW())
          RETURNING *
        `;
        const values = [article_id, user.username, body, 0];
        return db.query(query, values)
          .then((result) => result.rows[0]);
      });
  };


  const updateArticleVotes = (article_id, inc_votes) => {
    return db.query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *',
      [inc_votes, article_id]
    )
      .then((result) => {
        return result.rows[0];
      })
      .catch((err) => {
        throw err; 
      });
  }

  const deleteCommentById = (comment_id) => {
    const query = 'DELETE FROM comments WHERE comment_id = $1 RETURNING *';
  
    return db.query(query, [comment_id])
      .then((result) => {
        return result.rows[0];
      })
      .catch((err)=>{
        throw err;
      })
  };
module.exports = {
    fetchArticles,fetchAllArticles,fetchCommentCount,fetchArticleComments,insertCommentFunction,updateArticleVotes,deleteCommentById
}