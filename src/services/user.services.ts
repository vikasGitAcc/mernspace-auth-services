import type { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import type { UserData } from "../types/user.types";
import { Roles } from "../constants";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export class UserServices {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstname, lastname, email, password }: UserData) {
        const existingUser = await this.userRepository.findOne({
            where: { email },
        });
        if (existingUser) {
            const err = createHttpError(400, "email already exists!");
            throw err;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return await this.userRepository.save({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            role: Roles.CUSTOMER,
        });
    }
}
