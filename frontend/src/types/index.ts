export interface User {
    _id: string;
    email: string;
    username: string;
    profilePicture?: string;
    points: number;
    currentLevel?: Level;
    badges: Badge[];
    completedChallenges: CompletedChallenge[];
    streaks: {
        currentStreak: number;
        longestStreak: number;
        lastActivityDate?: Date;
    };
}

export interface Level {
    _id: string;
    name: string;
    requiredPoints: number;
    rewards: Reward[];
}

export interface Badge {
    name: string;
    icon: string;
    earnedAt: Date;
}

export interface Challenge {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    duration: string;
    points: number;
    carbonReduction: number;
    steps: string[];
}

export interface CompletedChallenge {
    challenge: Challenge;
    completedAt: Date;
    pointsEarned: number;
}

export interface Reward {
    type: 'sleva' | 'odznak' | 'přístup';
    description: string;
    value: any;
} 