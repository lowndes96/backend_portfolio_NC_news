const db = require('../db/connection');

function fetchAllUsers() {
    return db.query(`SELECT * FROM users;`).then((result) => {
      return result.rows;
    });
  }

  module.exports = {
    fetchAllUsers
  };