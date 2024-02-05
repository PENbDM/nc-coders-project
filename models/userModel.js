const db = require("../db/connection");


const getUserByUsername = async (username) => {
    const checkUserQuery = `SELECT * FROM users WHERE username = $1`;
  
    if (!username) {
      return null; 
    }
  
    const result = await db.query(checkUserQuery, [username]);
    if (result.rows.length === 0) {
      return null
    }
  
    return result.rows[0];
  };
  const fetchUsers = () => {
    let querySort = `SELECT * FROM users`;
    return db.query(querySort);
  };

  const createUser = async (user) => {
    const { username, name, avatar_url } = user;
  
    if (!username || !name) {
      throw new Error('Username and name are required');
    }
  
    const checkExistingQuery = `
      SELECT * FROM users
      WHERE username = $1 OR name = $2;
    `;
  
    const existingUsers = await db.query(checkExistingQuery, [username, name]);
  
    if (existingUsers.rows.length > 0) {
      const existingFields = existingUsers.rows.map((existingUser) => {
        if (existingUser.username === username) {
          return 'username';
        } else {
          return 'name';
        }
      });
  
      throw new Error(`User with ${existingFields.join(' and ')} already exists`);
    }
  
    const createUserQuery = `
      INSERT INTO users (username, name, avatar_url)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
  
    try {
      const result = await db.query(createUserQuery, [username, name, avatar_url]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
  
  module.exports ={
    getUserByUsername,fetchUsers,createUser
  }