const {findALlTopics, findArticleById} = require('../models/topics.model')
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
    if (endpoints){
        res.status(200).send({'api' : endpoints})
    }
    else {
        return Promise.reject({status: 404, msg: 'No results Found'})
    }
}

function getArticle(req,res,next){
    const {article_id} = req.params
    if (isNaN(article_id)){
        res.status(400).send({status: 400, msg: 'Bad Request'}) 
    }
    findArticleById(article_id)
    .then((article) => {
        if (article.length === 1){
            res.status(200).send({'article':article}) }
        else {
            return Promise.reject({status: 404, msg: 'No results Found'})
        }
    })
    .catch((err) => {next(err)})
}

module.exports = {getAllTopics, getApi, getArticle}