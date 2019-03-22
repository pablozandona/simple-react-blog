const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Blog = mongoose.model('Blog');
const Post = mongoose.model('Post');

const SEPARATOR = '@a)M(E)9mfe)(F';

router.get('/blog/list', async (req, res, next) => {
    try {
        res.send(await Blog.find().sort({lastUpdate: -1}));
    } catch (e) {
        res.status(404).send({error: true});
    }
});

router.post('/user/register', (req, res, next) => {
    const {body} = req;
    const user = new User(body);
    return user.save()
        .then(() => res.json({
            user: user,
            token: user.user + SEPARATOR + user.password
        }))
        .catch(next);
});

router.post('/user/authenticate', (req, res, next) => {
    const {body} = req;
    return User.findOne({user: body.user, password: body.password})
        .then((user) => {
            if (user) {
                res.json({
                    user: user,
                    token: user.user + SEPARATOR + user.password
                })
            } else {
                res.status(404).send({error: true});
            }
        })
        .catch(next);
});


router.get('/blog/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findOne({_id: id});
        if (blog) {
            res.send(blog);
        } else {
            res.status(404).send({error: true});
        }
    } catch (e) {
        res.status(404).send({error: true});
    }
});

router.get('/blog/:id/posts', async (req, res, next) => {
    try {
        const id = req.params.id;
        const blog = await Blog.findOne({_id: id});
        if (blog) {
            res.send(await Post.find({blogId: id}).sort({date: -1}));
        } else {
            res.status(404).send({error: true});
        }
    } catch (e) {
        res.status(404).send({error: true});
    }
});

router.all('*', async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const user = token.split(SEPARATOR)[0];
            const password = token.split(SEPARATOR)[1];
            const userDB = await User.findOne({user, password});
            if (userDB) {
                req.user = userDB.toJSON();
                next();
            } else {
                res.status(403).send({error: true});
            }
        }
    } catch (e) {
        res.status(403).send({error: true});
    }
});

router.post('/blog/create', (req, res, next) => {
    try {
        const user = req.user;
        const {body} = req;

        const blog = new Blog(body);
        blog.owner = user._id;

        return blog.save()
            .then((blog) => {
                if (blog) {
                    res.json(blog)
                } else {
                    res.status(404).send({error: true});
                }
            })
            .catch(next);
    } catch (e) {

    }
});

router.post('/post/create', async (req, res, next) => {
    const user = req.user;
    const {body} = req;
    const blog = await Blog.findOne({_id: body.blog, owner: user._id});

    if(!blog) {
        res.status(404).send({error: true});
        return;
    }

    const post = new Post(body);
    post.blogId = body.blog;

    return post.save()
        .then(async (post) => {
            if (post) {
                blog.lastUpdate = new Date();
                await blog.save();
                res.json(post)
            } else {
                res.status(404).send({error: true});
            }
        })
        .catch(next);
});

module.exports = router;
