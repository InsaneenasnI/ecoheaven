const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');

// Registrace
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Kontrola existence emailu
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email je již zaregistrován' });
        }

        // Validace hesla
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Heslo musí obsahovat minimálně 8 znaků, jedno velké písmeno a jedno číslo'
            });
        }

        const user = await User.create({
            email,
            password,
            username
        });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(201).json({ token, user: { email: user.email, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Chyba při registraci', error: error.message });
    }
});

// Přihlášení
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Nesprávný email nebo heslo' });
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Nesprávný email nebo heslo' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.json({ token, user: { email: user.email, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: 'Chyba při přihlášení', error: error.message });
    }
});

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

// Facebook OAuth
router.get('/facebook',
    passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${token}`);
    }
);

module.exports = router; 