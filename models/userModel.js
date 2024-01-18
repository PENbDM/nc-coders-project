const db = require("../db/connection");


const getUserByUsername = async (username) => {
    const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
  
    if (!username) {
      return null; 
    }
  
    const result = await db.query(checkUserQuery, [username]);
  
    if (result.rows.length === 0) {
      return null; 
    }
  
    return result.rows[0];
  };
  const fetchUsers = () => {
    let querySort = `SELECT * FROM users`;
    return db.query(querySort);
  };
  
  module.exports ={
    getUserByUsername,fetchUsers
  }