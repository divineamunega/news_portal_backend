import { NextFunction, Request, Response } from "express";
import { body, matchedData, validationResult } from "express-validator";
import AppError from "../errors/AppError";

const publishNewsValidator = () => [
	body("title")
		.exists()
		.withMessage("A news must have a title.")
		.notEmpty()
		.withMessage("Title cannot be empty"),

	body("description").notEmpty().withMessage("A news must have description"),
	body("content").notEmpty().withMessage("A news must have content"),
	body("section").notEmpty().withMessage("A news must have a section"),
	body("subSection").notEmpty().withMessage("A news must have a Sub Section"),
	handlePublishNewsData,
];

const handlePublishNewsData = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)

		return next(
			new AppError("Validation Error", 400, errors.array(), "express_validator")
		);
	}

	if (!req.file) {
		throw new AppError("An image is required", 400);
	}
	// Attach validated data to the request object

	req.data = matchedData(req);
	next();
};

const handleCommentData = function (
	req: Request,
	res: Response,
	next: NextFunction
) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		// Pass validation errors to the next middleware (error handler)

		return next(
			new AppError("Validation Error", 400, errors.array(), "express_validator")
		);
	}

	req.data = matchedData(req);
	next();
};

const newsValidator = [
	body("content").notEmpty().withMessage("You can not submit an empty comment"),
	handleCommentData,
];

export { publishNewsValidator, newsValidator };
