const express = require('express');
const app = express();
const {
  getAllTopics,
  getArticle,
  getAllArticles,
  getcommentsByArticle,
  postComment,
  patchVotes,
  deleteComment,
  getAllUsers
} = require('./controllers/topics.controller');
const {
  getApi
} = require('./controllers/api.controller')
const cors = require('cors'); 


app.use(cors()); 

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api', getApi);

app.get('/api/articles/:article_id', getArticle);

app.get('/api/articles', getAllArticles);

app.get('/api/articles/:article_id/comments', getcommentsByArticle);

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchVotes);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users',getAllUsers)

app.use((err, req, res, next) => {
  if (err.code === '22P02'){
    res.status(400).send({msg: 'Bad Request'})
  }
  else{
    next(err)
  }
})

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

module.exports = app;
