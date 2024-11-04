const models = require('../models');

function save(req, res){
    const post = {
        title: req.body.title,
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        categoryId: req.body.categoryId,
        userId: 1
    }
    models.Post.create(post).then(result => {
        res.status(201).json({
            message: "Post created successfully",
            post:
        });
    })
}

module,exports={
   
}