const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CarbonFootprint = require('../models/CarbonFootprint');
const { auth } = require('../middleware/auth');

// Získat profil uživatele
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('currentLevel')
            .populate('completedChallenges.challenge');

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání profilu', error: error.message });
    }
});

// Aktualizovat profil
router.patch('/profile', auth, async (req, res) => {
    const allowedUpdates = ['username', 'location', 'householdInfo', 'dietaryPreferences', 'transportationPreferences'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Neplatné aktualizace' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: 'Chyba při aktualizaci profilu', error: error.message });
    }
});

// Přidat uhlíkovou stopu
router.post('/carbon-footprint', auth, async (req, res) => {
    try {
        const footprint = new CarbonFootprint({
            ...req.body,
            user: req.user._id
        });

        footprint.calculateTotalFootprint();
        await footprint.save();

        // Přidání bodů za vyplnění kalkulačky
        await req.user.addPoints(10);
        await req.user.updateStreak();

        res.status(201).json(footprint);
    } catch (error) {
        res.status(400).json({ message: 'Chyba při ukládání uhlíkové stopy', error: error.message });
    }
});

// Získat historii uhlíkové stopy
router.get('/carbon-footprint/history', auth, async (req, res) => {
    try {
        const footprints = await CarbonFootprint.find({ user: req.user._id })
            .sort({ date: -1 })
            .limit(12); // Poslední rok po měsících

        res.json(footprints);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání historie', error: error.message });
    }
});

module.exports = router; 