const {findALlTopics} = require('../models/topics.model')
const endpoints = require('../endpoints.json')

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

function getApi(req,res,next){
    console.log(endpoints.length)
    if (endpoints){
        res.status(200).send({'api' : endpoints})
    }
    else {
        return Promise.reject({status: 404, msg: 'No results Found'})
    }
}

module.exports = {getAllTopics, getApi}