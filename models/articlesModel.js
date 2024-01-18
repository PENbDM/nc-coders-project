const db = require("../db/connection");
const {getUserByUsername} = require('./userModel')
const fetchArticlesById = (id) => {
    if (isNaN(id)) {
      return Promise.reject(new Error("Invalid article_id"));
    }
    const querySort = 'SELECT * FROM articles WHERE article_id = $1';
    return db.query(querySort, [id])
      .then((result) => {
        if (result.rows.length === 0) {
          return Promise.reject(new Error("Article not found"));
        }
        return result.rows;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };
  


  const fetchArticlesByTopic = (topic) => {
    const query = "SELECT * FROM articles WHERE topic = $1";
    return db.query(query, [topic]);
  };


  const fetchAllArticles = () => {
    let querySort = `SELECT * FROM articles`;
    return db.query(querySort);
  };

  const fetchCommentCount = (articleId) => {
    const query = `
        SELECT COUNT(*) AS comment_count
        FROM comments
        WHERE article_id = $1
      `;
    return db
      .query(query, [articleId])
      .then((result) => result.rows[0].comment_count);
  };

  const fetchArticleComments = (articleId) => {
    const query = `
        SELECT *
        FROM comments
        WHERE article_id = $1
      `;
  
    return db.query(query, [articleId]).then((result) => result.rows);
  };

  const insertCommentFunction = async (article_id, username, body) => {
    const user = await getUserByUsername(username);
  
    if (!user) {
      throw new Error("User with the provided username does not exist");
    }
  
    const query = `
      INSERT INTO comments (article_id, author, body, votes, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    const values = [article_id, user.username, body, 0];
  
    const result = await db.query(query, values);
    return result.rows[0];
  };

const updateArticleVotes = (article_id, inc_votes) => {
    return db
      .query(
        "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
        [inc_votes, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  };


  const deleteCommentById = (comment_id) => {
    const query = "DELETE FROM comments WHERE comment_id = $1 RETURNING *";
  
    return db
      .query(query, [comment_id])
      .then((result) => {
        return result.rows[0];
      })
  };

module.exports = {
    fetchArticlesById,fetchArticlesByTopic,fetchAllArticles,fetchCommentCount,fetchArticleComments,insertCommentFunction,updateArticleVotes,deleteCommentById
}