import type { Request } from "express";

export interface UserData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface loginData {
    email: string;
    password: string;
}

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface LoginUserRequest extends Request {
    body: loginData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
    };
}
