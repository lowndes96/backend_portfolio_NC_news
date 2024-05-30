const {
  findALlTopics,
  findArticleById,
  findAllArticles,
  findCommentsByArticle,
  checkArticleExists,
  makeNewComment,
  isExistingUser,
  changeVotes,
  removeComment,
  fetchAllUsers
} = require('../models/topics.model');
const endpoints = require('../endpoints.json');

function getAllTopics(req, res, next) {
  findALlTopics()
    .then((allTopics) => {
      if (allTopics.length > 0) {
        res.status(200).send({ topics: allTopics });
      } else {
        return Promise.reject({ status: 404, msg: 'No results Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function getApi(req, res, next) {
  if (endpoints) {
    res.status(200).send({ api: endpoints });
  } else {
    return Promise.reject({ status: 404, msg: 'No results Found' });
  }
}

function getArticle(req, res, next) {
  const { article_id } = req.params;
  if (isNaN(article_id)) {
    res.status(400).send({ status: 400, msg: 'Bad Request' });
  }
  findArticleById(article_id)
    .then((article) => {
      if (article.length === 1) {
        res.status(200).send({ article: article });
      } else {
        return Promise.reject({ status: 404, msg: 'No results Found' });
      }
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  findAllArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
}

function getcommentsByArticle(req, res, next) {
  const { article_id } = req.params;
  const promises = [checkArticleExists(article_id)];
  if (isNaN(article_id)) {
    res.status(400).send({ status: 400, msg: 'Bad Request' });
  }

  if (article_id) {
    promises.push(findCommentsByArticle(article_id));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[1];
      res.status(200).send({ comments: comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postComment(req, res, next) {
  const comment = req.body;
  if (!comment.hasOwnProperty('username') && !comment.hasOwnProperty('body')) {
    res.status(400).send({ status: 400, msg: 'Bad Request' });
  } else {
    const { article_id } = req.params;
    const promises = [
      isExistingUser(comment.username),
      checkArticleExists(article_id),
      makeNewComment(comment, article_id),
    ];

    Promise.all(promises)
      .then(([isUser, articleExists, newComment]) => {
        res.status(201).send({ newComment: newComment.body });
      })
      .catch((err) => {
        next(err);
      });
  }
}

function patchVotes(req, res, next) {
  const updateVote = req.body.inc_votes;
  const { article_id } = req.params;
  changeVotes(updateVote, article_id)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const commentId = req.params.comment_id;
  removeComment(commentId)
    .then((comment) => {
      if (comment[0].comment_id == commentId) {
        res.status(204).send({});
      }
    })
    .catch((err) => {
      next(err);
    });
}

function getAllUsers(req,res,next){
  console.log('get all users cont')
  fetchAllUsers().then((users) => {
    console.log(users)
    res.status(200).send({users})
  })
}

module.exports = {
  getAllTopics,
  getApi,
  getArticle,
  getAllArticles,
  getcommentsByArticle,
  postComment,
  patchVotes,
  deleteComment,
  getAllUsers
};
