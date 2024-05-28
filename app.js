
const express = require('express')
const app = express()
const {getAllTopics, getApi, getArticle} =require('./controllers/topics.controller')




app.get('/api/topics', getAllTopics)

app.get('/api',getApi )

app.get('/api/articles/:article_id', getArticle)



app.use((err,req,res,next) => {
    if (err.msg){
        res.status(err.status).send({'msg':err.msg})
    }
    else{
        next(err)
    }
})


module.exports = app