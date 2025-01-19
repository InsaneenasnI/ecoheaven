const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    requiredPoints: {
        type: Number,
        required: true
    },
    rewards: [{
        type: {
            type: String,
            enum: ['sleva', 'odznak', 'přístup'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        value: {
            type: mongoose.Schema.Types.Mixed, // pro slevy: číslo, pro odznaky: URL ikony, pro přístup: string
            required: true
        }
    }]
});

module.exports = mongoose.model('Level', levelSchema); 