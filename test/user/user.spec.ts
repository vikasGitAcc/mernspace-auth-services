import type { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data_source.ts";
import request from "supertest";
import { app } from "../../src/app.ts";
import { User } from "../../src/entity/user.entity.ts";
import { Roles } from "../../src/constants/index.ts";
import { createJWKSMock } from "mock-jwks";
import type { JWKSMock } from "mock-jwks";

describe("GET /auth/self", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let stopMock: ReturnType<JWKSMock["start"]>;
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        stopMock = jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        stopMock();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the status code 200", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };
            const userRepository = connection.getRepository(User);
            const user = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });
            const res = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            expect(res.statusCode).toBe(200);
        });

        it("should return the user data in respone", async () => {
            const userData = {
                firstname: "vikas",
                lastname: "singh",
                email: "vikas@spec.space",
                password: "secret123",
            };
            const userRepository = connection.getRepository(User);
            const user = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const accessToken = jwks.token({
                sub: String(user.id),
                role: user.role,
            });

            const res = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();

            expect(Number((res.body as Record<string, string>).id)).toBe(
                user.id
            );
        });
    });

    // describe("Given missing fields", () => {
    //     it("should return 400 if email is missing", async () => {
    //         const userData = {
    //             password: "secret123",
    //         };

    //         const res = await request(app).post("/auth/login").send(userData);
    //         expect(res.status).toBe(400);
    //     });
    // });
});
