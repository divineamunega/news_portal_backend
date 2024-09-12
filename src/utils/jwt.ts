import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN;

const signToken = function (id: string) {
	return jwt.sign({ id }, secret!, { expiresIn });
};

export { signToken };
