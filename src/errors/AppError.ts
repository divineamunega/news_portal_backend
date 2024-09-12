/**
 * AppError extends the built-in Error class to include additional properties
 * for handling operational errors in a more structured way.
 */
export default class AppError extends Error {
	public statusCode: number;
	public isOperational: boolean;
	public status: string;
	public errorObj?: any;
	public type?: string;

	/**
	 * Constructs a new AppError instance.
	 *
	 * @param message - The error message
	 * @param statusCode - The HTTP status code associated with the error
	 * @param errorObj - Optional additional error details
	 * @param type - Optional error type for categorization
	 */
	constructor(
		message: string,
		statusCode: number,
		errorObj?: any,
		type?: string
	) {
		super(message);

		// Assign the HTTP status code
		this.statusCode = statusCode;

		// Determine if the error is operational (i.e., expected)
		this.isOperational = true;

		// Set the error status based on the status code
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

		// Optional additional error details
		this.errorObj = errorObj;

		// Optional error type for categorization
		this.type = type;

		// Capture the stack trace (excluding the constructor itself)
		Error.captureStackTrace(this, this.constructor);
	}
}
