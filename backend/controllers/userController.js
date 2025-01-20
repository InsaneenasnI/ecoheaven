const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Validace hesla
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
        return { isValid: false, message: 'Heslo musí mít alespoň 8 znaků' };
    }
    if (!hasUpperCase) {
        return { isValid: false, message: 'Heslo musí obsahovat alespoň jedno velké písmeno' };
    }
    if (!hasNumber) {
        return { isValid: false, message: 'Heslo musí obsahovat alespoň jedno číslo' };
    }

    return { isValid: true };
};

// Registrace uživatele
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kontrola JWT_SECRET
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET není nastaven');
        }

        // Kontrola existence emailu
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email již existuje' });
        }

        // Validace hesla
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({ message: passwordValidation.message });
        }

        // Vytvoření uživatele
        const user = new User({ email, password });
        await user.save();

        // Vytvoření JWT tokenu
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Uživatel úspěšně zaregistrován',
            token,
            userId: user._id
        });
    } catch (error) {
        res.status(400).json({
            message: 'Chyba při registraci',
            error: error.message
        });
    }
};

// Aktualizace profilu (onboarding)
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.body;
        const profileData = req.body.profile;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Uživatel nenalezen' });
        }

        user.profile = {
            ...profileData,
            completed: true
        };

        await user.save();

        res.json({
            message: 'Profil úspěšně aktualizován',
            profile: user.profile
        });
    } catch (error) {
        res.status(400).json({ message: 'Chyba při aktualizaci profilu', error: error.message });
    }
};

// Přihlášení uživatele
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kontrola existence uživatele
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Nesprávný email nebo heslo'
            });
        }

        // Kontrola hesla
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                message: 'Nesprávný email nebo heslo'
            });
        }

        // Vytvoření JWT tokenu
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Přihlášení úspěšné',
            token,
            userId: user._id,
            profile: {
                email: user.email,
                profileCompleted: user.profile.completed
            }
        });
    } catch (error) {
        res.status(400).json({
            message: 'Chyba při přihlášení',
            error: error.message
        });
    }
}; 