import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { Config } from "../config/config.ts";
import type { RefreshToken } from "../entity/refreshToken.entity.ts";
import type { User } from "../entity/user.entity.ts";
import type { Repository } from "typeorm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TokenService {
    constructor(private refreshTokenRepo: Repository<RefreshToken>) {}
    generateAccessToken(payload: JwtPayload) {
        const privateKey = readFileSync(
            path.join(__dirname, "../../certs/privateKey.pem"),
            "utf-8"
        );

        const accessToken = jwt.sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth_service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload, newRefreshToken: RefreshToken) {
        const refreshToken = jwt.sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth_service",
            jwtid: String(newRefreshToken.id),
        });

        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const ms_expiry_period = 1000 * 60 * 60 * 24 * 365; //1y
        const newRefreshToken = await this.refreshTokenRepo.save({
            user: user,
            expiresAt: new Date(Date.now() + ms_expiry_period),
        });

        return newRefreshToken;
    }
}
