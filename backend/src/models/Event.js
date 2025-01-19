const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['úklid', 'workshop', 'trh', 'přednáška', 'jiné'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: {
            street: String,
            city: String,
            zipCode: String,
            country: String
        }
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['potvrzeno', 'možná', 'odmítnuto'],
            default: 'potvrzeno'
        }
    }],
    maxParticipants: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

eventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Event', eventSchema); 