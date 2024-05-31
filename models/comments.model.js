const db = require('../db/connection');

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

  module.exports = {
    findCommentsByArticle,
    makeNewComment,
    removeComment
  };