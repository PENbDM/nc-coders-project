const db = require("../db/connection");


const fetchUsers = () => {
    let querySort = `SELECT * FROM users`;
    return db.query(querySort)
};

module.exports = {
    fetchUsers
}