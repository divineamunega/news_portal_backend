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
		return res.status(400).json({ message: "Image is required" });
	}
	// Attach validated data to the request object

	req.data = matchedData(req);
	next();
};

export { publishNewsValidator };
