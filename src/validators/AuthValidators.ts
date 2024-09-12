import { User } from "@prisma/client";
import { handleData, handleLoginData } from "./handleRequestBody";
import { body } from "express-validator";
// Extend the Request interface to include a 'data' property
declare module "express-serve-static-core" {
	interface Request {
		data?: any;
		user?: User;
	}
}

/**
 * Validation chain for user signup.
 *
 * Validates the presence and format of 'name', 'email', and 'password' fields.
 *
 * @returns Array of validation chains and the handleData middleware
 */
const signupValidator = () => [
	body("name")
		.exists()
		.withMessage("A user must have a name")
		.trim()
		.notEmpty()
		.withMessage("Name cannot be empty"),
	body("email")
		.exists()
		.withMessage("A user must have an email")
		.trim()
		.isEmail()
		.withMessage("Please provide a valid email"),
	body("password")
		.exists()
		.withMessage("Please provide a password")
		.isLength({ min: 8 })
		.withMessage("Your password must be at least 8 characters long"),
	handleData,
];

const loginValidator = () => [
	body("password").isLength({ min: 8 }),
	body("email").trim().isEmail(),
	handleLoginData,
];

export { signupValidator, loginValidator };
