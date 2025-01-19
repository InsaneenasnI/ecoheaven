const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

// Získat všechny příspěvky
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání příspěvků', error: error.message });
    }
});

// Vytvořit nový příspěvek
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        const post = await Post.create({
            title,
            content,
            category,
            tags,
            author: req.user._id
        });

        await post.populate('author', 'username profilePicture');
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při vytváření příspěvku', error: error.message });
    }
});

// Přidat komentář k příspěvku
router.post('/:postId/comments', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Příspěvek nenalezen' });
        }

        post.comments.push({
            content: req.body.content,
            author: req.user._id
        });

        await post.save();
        await post.populate('comments.author', 'username profilePicture');

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při přidávání komentáře', error: error.message });
    }
});

// Like/Unlike příspěvku
router.post('/:postId/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: 'Příspěvek nenalezen' });
        }

        const likeIndex = post.likes.indexOf(req.user._id);
        if (likeIndex === -1) {
            post.likes.push(req.user._id);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při like/unlike příspěvku', error: error.message });
    }
});

module.exports = router; 