const {findALlTopics} = require('../models/topics.model')

function getAllTopics(req,res,next){
    findALlTopics()
    .then((allTopics) => {
        if (allTopics.length> 0){
            res.status(200).send({'topics':allTopics})
        }
        else{
            return Promise.reject({status: 404, msg: 'No results Found'})
        }
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = {getAllTopics}