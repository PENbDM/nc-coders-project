const { fetchUsers } = require('../models/userModel');


const getUsers = (req, res) => {
    fetchUsers().then((topics) => {
      res.status(200).send(topics.rows);
    });
  };


  module.exports = {
    getUsers
  }