
const express = require('express')
const app = express()
const {getAllTopics} =require('./controllers/topics.controller')



app.get('/api/topics', getAllTopics)

app.use((err,req,res,next) => {
    if (err.msg){
        res.status(err.status).send({'msg':err.msg})
    }
    else{
        next(err)
    }
})


module.exports = app