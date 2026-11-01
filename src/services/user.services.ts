import type { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import type { UserData } from "../types/user.types";
import { Roles } from "../constants";

export class UserServices {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstname, lastname, email, password }: UserData) {
        const data = await this.userRepository.save({
            firstname,
            lastname,
            email,
            password,
            role: Roles.CUSTOMER,
        });

        return data;
    }
}
