const { fetchUsers,getUserByUsername,createUser } = require('../models/userModel');


const getUsers = (req, res) => {
    fetchUsers().then((topics) => {
      res.status(200).send(topics.rows);
    });
  };

const getUserByName = (req,res)=>{
 const username = req.params.username;
 getUserByUsername(username)
 .then((user) => {
   if (!user) {
     res.status(404).json({ error: `User with username ${username} not found` });
   } else {
     res.status(200).json(user);
   }
 })
 .catch((error) => {
   res.status(500).json({ error: 'Internal Server Error' });
 });
};



const createUserController = async (req, res) => {
  try {
    const user = req.body;
    const newUser = await createUser(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  module.exports = {
    getUsers,getUserByName, createUserController
  }