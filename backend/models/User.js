const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profile: {
        completed: {
            type: Boolean,
            default: false
        },
        household: {
            type: {
                type: String,
                enum: ['byt', 'dům', 'jiné'],
                required: false
            },
            members: {
                type: Number,
                required: false
            }
        },
        diet: {
            type: String,
            enum: ['masožravec', 'všežravec', 'vegetarián', 'vegan', 'jiné'],
            required: false
        },
        transport: {
            primary: {
                type: String,
                enum: ['auto', 'kolo', 'veřejná doprava', 'chůze', 'jiné'],
                required: false
            },
            frequency: {
                type: String,
                enum: ['denně', 'několikrát týdně', 'příležitostně', 'jiné'],
                required: false
            }
        },
        ecoHabits: [{
            type: String,
            enum: [
                'třídění odpadu',
                'kompostování',
                'úspora vody',
                'úspora energie',
                'non toxic',
                'zero waste',
                'lokální produkty',
                'vlastní pěstování',
                'jiné'
            ]
        }],
        ecoScore: {
            total: { type: Number, default: 0 },
            categories: {
                household: { type: Number, default: 0 },
                diet: { type: Number, default: 0 },
                transport: { type: Number, default: 0 },
                habits: { type: Number, default: 0 }
            }
        },
        activities: [{
            type: { type: String, enum: ['recyklace', 'úspora', 'nákup', 'vzdělávání'] },
            description: String,
            points: Number,
            date: { type: Date, default: Date.now }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash hesla před uložením
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Metoda pro validaci hesla
userSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema); 