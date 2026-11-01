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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
                password: "secret",
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
    });
});
