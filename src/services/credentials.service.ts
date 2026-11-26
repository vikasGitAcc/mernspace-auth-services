import bcrypt from "bcrypt";
import createHttpError from "http-errors";

export class CredentialService {
    async comparePassword(
        password: string,
        hashPassword: string
    ): Promise<void> {
        const isMatch = await bcrypt.compare(password, hashPassword);
        if (!isMatch) {
            const error = createHttpError(400, "invalid email or password!");
            throw error;
        }
    }
}
