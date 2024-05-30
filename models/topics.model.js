const db = require('../db/connection');
const fs = require('fs/promises');
const { commentData } = require('../db/data/test-data');

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

function findAllArticles(filterBy) {
  let sqlQuery = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles 
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];

  if (filterBy) {
    sqlQuery += ` WHERE articles.topic = $1`;
    queryValues.push(filterBy);
  }

  sqlQuery += ` GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;

  return db.query(sqlQuery, queryValues).then((result) => {
    const editedOutput = result.rows.map((article) => {
      delete article.body;
      return article;
    });
    return editedOutput;
  });
}

function findCommentsByArticle(articleId) {
  const id = [articleId];
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
      id
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      return Promise.reject({ status: 400, msg: 'No results Found' });
    });
}

function checkArticleExists(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'No Article Found' });
      }
    });
}

function makeNewComment(newComment, articleId) {
  const inputArr = [newComment.username, newComment.body, articleId];
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1,$2,$3) RETURNING *;`,
      inputArr
    )
    .then(({ rows }) => rows[0]);
}

function isExistingUser(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 400, msg: 'User Not registered' });
      }
    });
}

function changeVotes(newVote, articleId) {
  const queryValues = [newVote, articleId];
  const sqlQuery = `UPDATE articles 
  SET votes = votes + $1 WHERE  article_id = $2 RETURNING *;`;
  return db.query(sqlQuery, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'No Article Found' });
    } else {
      return result.rows[0];
    }
  });
}

function removeComment(commentId) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentId,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      }
      return result.rows;
    });
}

function fetchAllUsers() {
  return db.query(`SELECT * FROM users;`).then((result) => {
    return result.rows;
  });
}

module.exports = {
  findALlTopics,
  findArticleById,
  findAllArticles,
  findCommentsByArticle,
  checkArticleExists,
  makeNewComment,
  isExistingUser,
  changeVotes,
  removeComment,
  fetchAllUsers,
};
