import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/UserController";
import { protect } from "../controllers/AuthController";

const router = Router();

router.get("/", protect({ role: "ADMIN" }), getUsers);
router.delete("/:userId", protect({ role: "ADMIN" }), deleteUser);

export default router;
