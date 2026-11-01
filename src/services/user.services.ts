import { AppDataSource } from "../config/data_source";
import { User } from "../entity/user.entity";

export class UserServices {
    async create(
        firstname: string,
        lastname: string,
        email: string,
        password: string
    ) {
        const userRepository = AppDataSource.getRepository(User);
        const data = await userRepository.save({
            firstname,
            lastname,
            email,
            password,
        });

        return data;
    }
}
