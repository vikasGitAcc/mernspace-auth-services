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
import { truncateTables } from "../utils/truncate.tuils.ts";
import { User } from "../../src/entity/user.entity.ts";

describe("/auth/register", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // database truncate
        await truncateTables(connection);
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
        });
        // describe("files are missing", () => {

        // })
    });
});
