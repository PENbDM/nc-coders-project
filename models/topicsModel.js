const db = require("../db/connection");

const fetchTopics = () => {
    let querySort = `SELECT * FROM topics`;
    return db.query(querySort)
};


module.exports = {
    fetchTopics
}