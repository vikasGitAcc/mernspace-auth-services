import type { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data_source.ts";
import request from "supertest";
import { app } from "../../src/app.ts";
import { isJWT } from "../utils/truncate.tuils.ts";

describe("POST /auth/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the status code 200", async () => {
            const userData = {
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app)
                .post("/auth/register")
                .send({ ...userData, firstname: "vikas", lastname: "singh" });

            const res = await request(app).post("/auth/login").send(userData);
            // console.log(res);
            expect(res.status).toBe(200);
        });

        it("should return 400 if email or password is invalid", async () => {
            const userData = {
                email: "vikas@spec.space",
                password: "secret1234",
            };

            await request(app)
                .post("/auth/register")
                .send({ ...userData, firstname: "vikas", lastname: "singh" });

            const res = await request(app)
                .post("/auth/login")
                .send({ ...userData, password: "secret" });
            expect(res.status).toBe(400);
        });

        it("should return access token and refresh token in response", async () => {
            const userData = {
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app)
                .post("/auth/register")
                .send({ ...userData, firstname: "vikas", lastname: "singh" });

            const res = await request(app).post("/auth/login").send(userData);

            interface Headers {
                "set-cookie"?: string[];
            }

            let accessToken = null;
            let refreshToken = null;

            const cookies = (res.headers as Headers)["set-cookie"] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken")) {
                    accessToken = cookie.split(";")[0]?.split("=")[1];
                }
                if (cookie.startsWith("refreshToken")) {
                    refreshToken = cookie.split(";")[0]?.split("=")[1];
                }
            });

            expect(isJWT(accessToken)).toBe(true);
            expect(isJWT(refreshToken)).toBe(true);
        });
    });

    describe("Given missing fields", () => {
        it("should return 400 if email is missing", async () => {
            const userData = {
                password: "secret123",
            };

            const res = await request(app).post("/auth/login").send(userData);
            expect(res.status).toBe(400);
        });

        it("should return 400 if password is missing", async () => {
            const userData = {
                email: "vikas.spec.space",
            };

            const res = await request(app).post("/auth/login").send(userData);
            expect(res.status).toBe(400);
        });
    });
});
