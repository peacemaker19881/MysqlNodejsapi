const express = require('express');

const app = express();


app.get('/',(req,res) =>{
    res.send("Hello my collegues developers");
});

app.get('/blog',(req,res) =>{
    res.send("Hello blog");
});

app.get('/posts',(req,res) =>{
    res.send("Post list");
});
module.exports = app