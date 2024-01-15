const db = require("../db/connection");

const fetchTopics = () => {
    let querySort = `SELECT * FROM topics`;
    console.log(db.query(querySort));
    return db.query(querySort)
};


module.exports = {
    fetchTopics
}