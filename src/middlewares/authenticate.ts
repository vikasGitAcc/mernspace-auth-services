import { expressjwt } from "express-jwt";
import jwksClient from "jwks-rsa";
import { Config } from "../config/config";
import type { Request } from "express";

export default expressjwt({
    secret: jwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        rateLimit: true,
        cache: true,
    }),
    algorithms: ["RS256"],
    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        type authCookie = {
            accessToken: string;
        };

        const { accessToken: token } = req.cookies as authCookie;
        return token;
    },
});
