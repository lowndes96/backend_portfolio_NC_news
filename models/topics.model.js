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

function findAllArticles(){
    // const commentCount = db.query(`SELECT COUNT(body) AS comment_count FROM comments WHERE `)
    return db.query(`SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`)
    .then((result) => {
        return result.rows
    })
}

module.exports = {findALlTopics, findArticleById,findAllArticles}