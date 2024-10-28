const express = require('express')
const postsController = require('../controllers/post.controller');

const router = express.Router();

router.get('/posts', (req, res) => {
    res.send('Response from router');
});

module.exports = router;