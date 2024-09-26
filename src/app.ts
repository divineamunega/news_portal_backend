import { Response, Request, NextFunction } from "express";
import express from "express";
import AuthRoute from "./routes/AuthRoutes";
import AppError from "./errors/AppError";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleErrorDev, handleErrorProd } from "./errors/ErrorHandlers";
import UserRoutes from "./routes/UserRoutes";
import NewsRoutes from "./routes/NewsRoutes";

const app = express();

// Special Middlewares
app.use(cookieParser());
app.use(
	cors({
		origin: ["http://localhost:5173", "https://acu-news-portal.vercel.app"],
		credentials: true,
		optionsSuccessStatus: 200,
		methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
	})
);
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
app.use(morgan("tiny"));

app.use("/api/v1/auth", AuthRoute);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/news", NewsRoutes);

app.get("/api/cron", (req: Request, res: Response) => {
	console.log("CRON REQUEST");
	res.status(200).json({
		status: "success",
		message: "Hello to the cronjob.",
	});
});

app.use("*", (req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: `The ${req.method} request is not available on ${req.originalUrl}`,
	});
});

app.use((error: AppError, req: Request, res: Response, next: NextFunction) => {
	let formatedErr;

	if (process.env.ENVIROMENT === "PRODUCTION" || process.env.MODE === "ERROR") {
		formatedErr = handleErrorProd(error);
		const { statusCode, ...remainingFormatedErr } = formatedErr;
		res.status(statusCode).json(remainingFormatedErr);
		return;
	}

	if (process.env.ENVIROMENT === "DEVELOPMENT") {
		formatedErr = handleErrorDev(error);
		res.status(formatedErr.statusCode || 500).json(formatedErr);
		return;
	}
});
export default app;
