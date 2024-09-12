/**
 * Handles errors for production environment.
 *
 * @param err - THe Error Instance
 * @returns A standardized error response
 */
const handleErrorProd = (err: any) => {
	// Handle validation errors specifically
	if (err.type === "express_validator") {
		const errorMessages = err.errorObj?.map((obj: any) => obj.msg).join(", ");

		const error = {
			status: err.status,
			statusCode: err.statusCode,
			message: errorMessages,
		};

		return error;
	}

	// Handle Email duplicate errors (hopefully)
	// TODO I have a better way to do this that will require finding a user with that email... But I guess it will take time.. Will look into it later
	// P2002 Errors are for more than duplicate emails... SO that's why

	if (err.code === "P2002") {
		const message = `A user with that email already exists.`;

		return {
			status: "fail",
			statusCode: 409,
			message,
		};
	}

	// Handle Failed Login Errors
	if (err.type === "login_error") {
		return {
			status: "fail",
			statusCode: err.statusCode,
			message: "Email or password is incorrect.",
		};
	}

	if (err.name === "JsonWebTokenError") {
		return {
			status: "fail",
			statusCode: 401,
			message:
				"Your token is invalid. Please login again to get another token.",
		};
	}

	if (!err.isOperational) {
		// Return generic error message for non-operational errors
		return {
			status: "error",
			message: "An unexpected error occurred. Please try again later.",
			statusCode: 500,
		};
	}

	// Return the error response for all other operational errors
	return {
		status: err.status,
		statusCode: err.statusCode,
		message: err.message,
	};
};

/**
 * Handles errors for development environment.
 *
 * @param err - The Error INstance
 * @returns Detailed error information
 */
const handleErrorDev = (err: any) => {
	return {
		message: err.message,
		err,
		stack: err.stack,
		statusCode: err.statusCode,
	};
};

export { handleErrorProd, handleErrorDev };
