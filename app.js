const express = require('express');
const app = express();
const {
  getAllTopics,
  getApi,
  getArticle,
  getAllArticles,
  getcommentsByArticle,
  postComment,
  patchVotes, 
  deleteComment
} = require('./controllers/topics.controller');

app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.get('/api/articles/:article_id', getArticle);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getcommentsByArticle);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchVotes)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
