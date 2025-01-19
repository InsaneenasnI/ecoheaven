const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { auth } = require('../middleware/auth');

// Získat všechny výzvy
router.get('/', auth, async (req, res) => {
    try {
        const challenges = await Challenge.find();
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání výzev', error: error.message });
    }
});

// Získat výzvy podle kategorie
router.get('/category/:category', auth, async (req, res) => {
    try {
        const challenges = await Challenge.find({ category: req.params.category });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání výzev', error: error.message });
    }
});

// Přidat novou výzvu (pouze pro adminy - později přidat middleware pro kontrolu role)
router.post('/', auth, async (req, res) => {
    try {
        const challenge = await Challenge.create(req.body);
        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při vytváření výzvy', error: error.message });
    }
});

module.exports = router; 