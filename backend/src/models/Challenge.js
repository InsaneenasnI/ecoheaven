const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['domácnost', 'doprava', 'stravování', 'komunita'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['začátečník', 'pokročilý', 'expert'],
        required: true
    },
    duration: {
        type: String,
        enum: ['denní', 'týdenní', 'měsíční'],
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    carbonReduction: {
        type: Number, // v kg CO2
        required: true
    },
    steps: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema); 