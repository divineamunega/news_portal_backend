import { Router } from "express";
import { loginValidator, signupValidator } from "../validators/AuthValidators";
import {
	loggedIn,
	login,
	protect,
	signup,
	signupPublisher,
	registerAdmin,
} from "../controllers/AuthController";

const router = Router();

router.post("/signup", signupValidator(), signup);
router.post(
	"/signupPublisher",
	signupValidator(),
	protect({ role: "ADMIN" }),
	signupPublisher
);

router.post(
	"/signupAdmin",
	signupValidator(),
	protect({ role: "ADMIN" }),
	registerAdmin
);
router.post("/login", loginValidator(), login);
router.get("/check", protect({ role: "USER" }), loggedIn);

export default router;
