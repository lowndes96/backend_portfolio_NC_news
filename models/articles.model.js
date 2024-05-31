const db = require('../db/connection');

function findArticleById(articleId) {
    return db
      .query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
   WHERE articles.article_id =$1 GROUP BY articles.article_id;`, [articleId])
      .then((result) => {
        return result.rows;
      })
  }
  
  function findAllArticles(filterBy) {
    let sqlQuery = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
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
      return result.rows;
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

module.exports = {
    findArticleById,
    findAllArticles,
    changeVotes
  }; 