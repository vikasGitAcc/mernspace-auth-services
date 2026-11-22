/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import request from "supertest";
import {
    describe,
    expect,
    it,
    beforeAll,
    afterAll,
    beforeEach,
} from "@jest/globals";
import { app } from "../../src/app.ts";
import type { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data_source.ts";
import { User } from "../../src/entity/user.entity.ts";
import { Roles } from "../../src/constants/index.ts";
import { isJWT } from "../utils/truncate.tuils.ts";
import { RefreshToken } from "../../src/entity/refreshToken.entity.ts";

describe("/auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // database truncate
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the status code 201", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const res = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(res.status).toBe(201);
        });

        // application/json
        it("should return the response in json format", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const res = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(res.header["content-type"]).toEqual(
                expect.stringContaining("json")
            );
        });

        it("should verify the user persistence in the database", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0]?.firstname).toBe(userData.firstname);
            expect(users[0]?.lastname).toBe(userData.lastname);
            expect(users[0]?.email).toBe(userData.email);
        });

        it("should verify the id of the newly created user", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.body).toHaveProperty("id");
        });

        it("should assign role to the user", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0]).toHaveProperty("role");
            expect(users[0]?.role).toBe(Roles.CUSTOMER);
        });

        it("should store the hashed password in the database", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0]).toHaveProperty("password");
            expect(users[0]?.password).not.toBe(userData.password);
            expect(users[0]?.password).toHaveLength(60);
            expect(users[0]?.password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 if email already exists in the database", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const users = await userRepository.find();

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it("should return the id of the newly registered user in response", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(response.body).toHaveProperty("id");

            expect(response.body?.id).toBeDefined();
            expect(typeof response.body?.id).toBe("number");
            expect(response.body?.id).toBe(users[0]?.id);
        });

        it("should return validation errors in array format", async () => {
            const userData = {
                firstname: "",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(Array.isArray(response.body.errors)).toBe(true);
        });

        it("should return access token and refresh token in the response", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            let accessToken = null;
            let refreshToken = null;

            interface Headers {
                "set-cookie"?: string[];
            }

            const cookies = (response.headers as Headers)["set-cookie"] || [];
            cookies.forEach((cookie: string) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0]?.split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0]?.split("=")[1];
                }
            });

            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJWT(accessToken)).toBeTruthy();
            expect(isJWT(refreshToken)).toBeTruthy();
        });

        it("should store refresh token in the database", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            await request(app).post("/auth/register").send(userData);

            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const refreshTokens = await refreshTokenRepo.find();

            expect(refreshTokens).toHaveLength(1);
        });
    });

    describe("Given missing fields", () => {
        it("should return 400 if email is missing", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                password: "secret123",
                email: "",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // console.log(response.body);

            expect(response.statusCode).toBe(400);
            const usersRepository = connection.getRepository(User);
            const users = await usersRepository.find();
            expect(users).toHaveLength(0);
        });

        it("should return 400 if firstname is missing", async () => {
            const userData = {
                firstname: "",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it("should return 400 if lastname is missing", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "",
                email: "vikas@spec.space",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });

        it("should return 400 if password is missing", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
    });

    describe("Fields are not in proper format", () => {
        it("should trim the email field", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: " vikas@spec.space ",
                password: "secret123",
            };

            await request(app).post("/auth/register").send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users[0]?.email).toBe("vikas@spec.space");
        });

        it("should return 400 if email is in invalid format", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "invalid-email",
                password: "secret123",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // console.log(response.body);

            expect(response.statusCode).toBe(400);
        });

        it("should return 400 if password length is less than 8 characters", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "1234567",
            };

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(400);
        });
    });
});
