const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        required: function () {
            return !this.googleId && !this.facebookId;
        },
        minlength: 8
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    googleId: String,
    facebookId: String,
    profilePicture: String,
    location: String,
    ecoScore: {
        type: Number,
        default: 0
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    },
    householdInfo: {
        type: {
            type: String,
            enum: ['byt', 'dům']
        },
        members: Number
    },
    dietaryPreferences: {
        type: String,
        enum: ['všežravec', 'vegetarián', 'vegan']
    },
    transportationPreferences: [{
        type: String,
        enum: ['auto', 'kolo', 'veřejná doprava', 'chůze']
    }],
    points: {
        type: Number,
        default: 0
    },
    currentLevel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    },
    badges: [{
        name: String,
        icon: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    completedChallenges: [{
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
        },
        completedAt: {
            type: Date,
            default: Date.now
        },
        pointsEarned: Number
    }],
    streaks: {
        currentStreak: {
            type: Number,
            default: 0
        },
        lastActivityDate: Date,
        longestStreak: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Hash hesla před uložením
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Metoda pro ověření hesla
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Přidáme metodu pro přidání bodů
userSchema.methods.addPoints = async function (points) {
    this.points += points;

    // Aktualizace úrovně
    const nextLevel = await mongoose.model('Level').findOne({
        requiredPoints: { $gt: this.points }
    }).sort('requiredPoints');

    if (nextLevel && (!this.currentLevel || this.currentLevel.toString() !== nextLevel._id.toString())) {
        this.currentLevel = nextLevel._id;
    }

    await this.save();
    return this;
};

// Přidáme metodu pro aktualizaci streaku
userSchema.methods.updateStreak = async function () {
    const today = new Date();
    const lastActivity = this.streaks.lastActivityDate;

    if (!lastActivity) {
        this.streaks.currentStreak = 1;
    } else {
        const diffDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            this.streaks.currentStreak += 1;
        } else if (diffDays > 1) {
            this.streaks.currentStreak = 1;
        }
    }

    if (this.streaks.currentStreak > this.streaks.longestStreak) {
        this.streaks.longestStreak = this.streaks.currentStreak;
    }

    this.streaks.lastActivityDate = today;
    await this.save();
};

module.exports = mongoose.model('User', userSchema); 