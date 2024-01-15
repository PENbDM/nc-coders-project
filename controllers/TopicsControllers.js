const {fetchTopics} = require('../models/topicsModel')

const getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send(topics.rows);
        })
        .catch((err) => next(err));
};

module.exports ={
    getTopics
}