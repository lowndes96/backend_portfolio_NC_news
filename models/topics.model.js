const db = require('../db/connection')
const fs = require('fs/promises')

function findALlTopics(){
    return db
    .query('SELECT * FROM topics')
    .then((result => {
        return result.rows
    }))
}

function findArticleById(articleId){
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {
        return result.rows
    })
}

module.exports = {findALlTopics, findArticleById}