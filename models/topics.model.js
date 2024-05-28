const db = require('../db/connection')

function findALlTopics(){
    // console.log('in model')
    return db
    .query('SELECT * FROM topics')
    .then((result => {
        return result.rows
    }))
}

module.exports = {findALlTopics}