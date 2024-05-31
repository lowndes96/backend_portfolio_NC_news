const db = require('../db/connection');

function isExistingUser(username) {
    return db
      .query(`SELECT * FROM users WHERE username = $1`, [username])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 400, msg: 'User Not registered' });
        }
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

  function topicExists(topic){
    return db.query('SELECT * FROM topics WHERE topics.slug = $1', [topic])
    .then((result) => {
      return result.rows
  })
  }

  module.exports = {
    checkArticleExists,
    isExistingUser,
    topicExists
  };