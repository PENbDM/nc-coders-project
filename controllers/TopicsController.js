const { fetchTopics } = require("../models/topicsModel");

const getTopics = (req, res) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send(topics.rows);
    })};

    module.exports = {
        getTopics
    }