import { checkSchema } from "express-validator";

export default checkSchema({
    email: {
        errorMessage: "Email is required!",
        notEmpty: true,
        trim: true,
        isEmail: {
            errorMessage: "Email is invalid!",
        },
    },
    firstname: {
        errorMessage: "Firstname is required!",
        notEmpty: true,
    },
    lastname: {
        errorMessage: "Lastname is required!",
        notEmpty: true,
    },
    password: {
        errorMessage: "Password is required!",
        notEmpty: true,
        isLength: {
            options: { min: 8 },
            errorMessage: "Password must be at least 8 characters long!",
        },
    },
});

// export default [body("email").notEmpty().withMessage("Email is required!")];
