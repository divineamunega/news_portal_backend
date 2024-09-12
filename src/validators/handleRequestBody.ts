import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import AppError from "../errors/AppError";

/**
 * Middleware to handle validation errors and extract validated data.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
const handleData = (req: Request, res: Response, next: NextFunction): void => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)
		return next(
			new AppError("Validation Error", 400, errors.array(), "express_validator")
		);
	}

	// Attach validated data to the request object
	req.data = matchedData(req);
	next();
};

const handleLoginData = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)
		return next(new AppError("Authentication Error", 401, null, "login_error"));
	}

	// Attach validated data to the request object
	req.data = matchedData(req);
	next();
};

export { handleData, handleLoginData };
