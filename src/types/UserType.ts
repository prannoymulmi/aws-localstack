import {z} from "zod";

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

export type AuthorizationRequest ={
    response_type: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    state: string;
    codeChallenge: string;
    code_challenge_method: string;
    username: string;
    password: string;
}

export type TokenRequest ={
    grant_type: string;
    code: string;
    redirect_uri: string;
    client_id: string;
    codeVerifier: string;
}


export const authorizationSchema = z.object({
    response_type: z.literal('code').optional() ,
    username: z.string(),
    password: z.string(),
    client_id: z.string(),
    redirect_uri: z.string().url().optional() ,
    scope: z.string().optional() ,
    state: z.string().optional() ,
    codeChallenge: z.string(),
    code_challenge_method: z.literal('S256').optional() ,
});

export const tokenRequestSchema = z.object({
    grant_type: z.literal('authorization_code'),
    authorizationCode: z.string(),
    redirect_uri: z.string().url().optional(),
    client_id: z.string(),
    codeVerifier: z.string()
});
