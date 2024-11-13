type UserProfile = {
    name: string;
    email: string;
};

export type User = {
    id: string;
    codeChallenge: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    user_email: string;
    password: string;
    userProfile: UserProfile;
};