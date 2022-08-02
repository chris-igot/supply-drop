const { Post } = require('../models/post.model');

module.exports = {
    createPost: async (req, res) => {
        try {
            const userToken = res.locals.payload;
            const file = req.file;
            let post = req.body;

            post.postedBy = userToken.id;

            if (file) {
                post.image = file.filename;
            }

            if (post.postType === 'offering' && !file) {
                throw new Error('Post must contain an image');
            }

            const newpost = await Post.create(post);
            res.json(newpost);
        } catch (err) {
            console.log(err);
            res.status(400).json(err);
        }
    },

    getPost: (req, res) => {
        Post.findOne({ _id: req.params.id })
            .populate('postedBy', '-password')
            .then((post) => res.json(post))
            .catch((err) => res.json(err));
    },

    getAllPosts: (req, res) => {
        Post.find({})
            .populate('postedBy', '-password')
            .then((post) => res.json(post))
            .catch((err) => res.json(err));
    },

    updatePost: (req, res) => {
        try {
            const userToken = res.locals.payload;
            const file = req.file;
            let post = req.body;
            let query = { _id: req.params.id, postedBy: userToken.id };

            if (file) {
                post['image'] = file.filename;
            }

            Post.findOneAndUpdate(query, post, {
                new: true,
            }).then((updatePost) => {
                if (updatePost) {
                    res.json(updatePost);
                } else {
                    res.status(404).json({
                        message: 'Post not found or wrong postType',
                    });
                }
            });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(400).json(err);
        }
    },

    deletePost: (req, res) => {
        const userToken = res.locals.payload;

        Post.deleteOne({ _id: req.params.id, postedBy: userToken.id })
            .then((deleteConfirmation) => res.json(deleteConfirmation))
            .catch((err) => res.json(err));
    },
};
