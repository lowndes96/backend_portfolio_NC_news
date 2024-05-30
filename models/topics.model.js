const db = require('../db/connection');
const fs = require('fs/promises');

function findALlTopics() {
  return db.query('SELECT * FROM topics').then((result) => {
    return result.rows;
  });
}

function findArticleById(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((result) => {
      return result.rows;
    });
}

function findAllArticles() {
  // const commentCount = db.query(`SELECT COUNT(body) AS comment_count FROM comments WHERE `)
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
    .then((result) => {
      const editedOutput = result.rows.map((article) => {
        delete article.body;
        return article;
      });
      return editedOutput;
    });
}

function findCommentsByArticle(articleId) {
  const id = [articleId];
//   console.log('find comms')
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      id
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {return Promise.reject({'status':400, 'msg':'No results Found*'})})
}

function checkArticleExists(articleId) {
  return db
  .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
  .then(({rows})=> {
    if (!rows.length){
        return Promise.reject({'status':404, 'msg':'No Article Found'})
    }
  })
}

function makeNewComment(newComment, articleId){
    const inputArr = [newComment.username, newComment.body, articleId]
    return db
    .query(`INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;`, inputArr)
    .then(({rows}) => rows[0])
}

function isExistingUser(username){
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows})=> {
      if (!rows.length){
          return Promise.reject({'status':400, 'msg':'User Not registered'})
      }
    })
}

function changeVotes(newVote, articleId){
  const queryValues = [newVote, articleId]
  const sqlQuery = `UPDATE articles 
  SET votes = votes + $1 WHERE  article_id = $2 RETURNING *;`
  return db.query(sqlQuery, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({'status':404, 'msg':'No Article Found'})
    }
    else{
      return result.rows[0]
    }
  })
}

module.exports = {
  findALlTopics,
  findArticleById,
  findAllArticles,
  findCommentsByArticle,
  checkArticleExists,
  makeNewComment, 
  isExistingUser,
  changeVotes
};
