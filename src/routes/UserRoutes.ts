import { Router } from "express";
import { getUsers } from "../controllers/UserController";
import { protect } from "../controllers/AuthController";

const router = Router();

router.get("/", protect({ role: "ADMIN" }), getUsers);

export default router;
