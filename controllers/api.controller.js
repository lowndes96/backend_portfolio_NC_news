const endpoints = require('../endpoints.json');

function getApi(req, res, next) {
    if (endpoints) {
      res.status(200).send({ api: endpoints });
    }
  }

  module.exports = {
    getApi
  };
  