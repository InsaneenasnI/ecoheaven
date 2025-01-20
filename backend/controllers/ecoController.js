const User = require('../models/user');

// Výpočet eko-skóre
const calculateEcoScore = (profile) => {
    let score = {
        household: 0,
        diet: 0,
        transport: 0,
        habits: 0
    };

    // Hodnocení bydlení
    if (profile.household) {
        score.household += profile.household.members > 1 ? 10 : 5; // Sdílené bydlení je ekologičtější
    }

    // Hodnocení stravování
    switch (profile.diet) {
        case 'vegan':
            score.diet = 30;
            break;
        case 'vegetarián':
            score.diet = 25;
            break;
        case 'všežravec':
            score.diet = 15;
            break;
        case 'masožravec':
            score.diet = 10;
            break;
    }

    // Hodnocení dopravy
    switch (profile.transport.primary) {
        case 'chůze':
            score.transport = 30;
            break;
        case 'kolo':
            score.transport = 25;
            break;
        case 'veřejná doprava':
            score.transport = 20;
            break;
        case 'auto':
            score.transport = 10;
            break;
    }

    // Hodnocení ekologických návyků
    if (profile.ecoHabits) {
        score.habits = profile.ecoHabits.length * 5; // 5 bodů za každý návyk
    }

    // Celkové skóre
    const total = Object.values(score).reduce((a, b) => a + b, 0);

    return {
        total,
        categories: score
    };
};

// Získání doporučení na základě profilu
const getRecommendations = (profile) => {
    const recommendations = [];

    // Doporučení podle stravování
    if (profile.diet === 'masožravec') {
        recommendations.push({
            category: 'diet',
            title: 'Zkuste bezmasý den',
            description: 'Začněte jedním dnem v týdnu bez masa pro snížení uhlíkové stopy.',
            points: 5
        });
    }

    // Doporučení podle dopravy
    if (profile.transport.primary === 'auto') {
        recommendations.push({
            category: 'transport',
            title: 'Využijte veřejnou dopravu',
            description: 'Zkuste alespoň jednou týdně využít veřejnou dopravu místo auta.',
            points: 5
        });
    }

    // Doporučení podle návyků
    if (!profile.ecoHabits.includes('kompostování')) {
        recommendations.push({
            category: 'habits',
            title: 'Začněte s kompostováním',
            description: 'Kompostování může snížit váš odpad až o 30%.',
            points: 10
        });
    }

    return recommendations;
};

// Aktualizace eko-skóre
exports.updateEcoScore = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Uživatel nenalezen' });
        }

        const ecoScore = calculateEcoScore(user.profile);
        user.profile.ecoScore = ecoScore;
        await user.save();

        res.json({
            message: 'Eko-skóre aktualizováno',
            ecoScore
        });
    } catch (error) {
        res.status(400).json({ message: 'Chyba při aktualizaci eko-skóre', error: error.message });
    }
};

// Získání doporučení
exports.getRecommendations = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Uživatel nenalezen' });
        }

        const recommendations = getRecommendations(user.profile);
        res.json({
            ecoScore: user.profile.ecoScore,
            recommendations
        });
    } catch (error) {
        res.status(400).json({ message: 'Chyba při získávání doporučení', error: error.message });
    }
}; 