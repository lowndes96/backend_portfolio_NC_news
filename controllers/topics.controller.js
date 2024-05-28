const {findALlTopics} = require('../models/topics.model')

function getAllTopics(req,res,next){
    // console.log('in controller')
    findALlTopics().then((allTopics) => {
        res.status(200).send({'topics':allTopics})
    })
}

module.exports = {getAllTopics}