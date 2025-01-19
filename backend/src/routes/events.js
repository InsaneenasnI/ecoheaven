const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

// Získat všechny události v okolí
router.get('/nearby', auth, async (req, res) => {
    try {
        const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance v metrech

        const events = await Event.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: maxDistance
                }
            },
            date: { $gte: new Date() }
        }).populate('organizer', 'username profilePicture');

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při načítání událostí', error: error.message });
    }
});

// Vytvořit novou událost
router.post('/', auth, async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer: req.user._id,
            location: {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude],
                address: req.body.address
            }
        };

        const event = await Event.create(eventData);
        await event.populate('organizer', 'username profilePicture');

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při vytváření události', error: error.message });
    }
});

// Přihlásit se na událost
router.post('/:eventId/join', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Událost nenalezena' });
        }

        // Kontrola, zda již není přihlášen
        const existingParticipant = event.participants.find(
            p => p.user.toString() === req.user._id.toString()
        );

        if (existingParticipant) {
            return res.status(400).json({ message: 'Již jste přihlášeni na tuto událost' });
        }

        // Kontrola kapacity
        if (event.participants.length >= event.maxParticipants) {
            return res.status(400).json({ message: 'Událost je již plně obsazena' });
        }

        event.participants.push({
            user: req.user._id,
            status: req.body.status || 'potvrzeno'
        });

        await event.save();
        await event.populate('participants.user', 'username profilePicture');

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Chyba při přihlašování na událost', error: error.message });
    }
});

module.exports = router; 