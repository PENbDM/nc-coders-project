const db = require("../db/connection");

const fetchArticles = (id) => {
    let querySort = `SELECT * FROM articles WHERE article_id = ${id}`;
    return db.query(querySort)
};


module.exports = {
    fetchArticles
}