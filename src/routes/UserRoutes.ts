import { Router } from "express";
import { deleteUser, editUser, getUsers } from "../controllers/UserController";
import { protect } from "../controllers/AuthController";

const router = Router();

router.get("/", protect({ role: "ADMIN" }), getUsers);
router.delete("/:userId", protect({ role: "ADMIN" }), deleteUser);
router.patch("/:userId", protect({ role: "ADMIN" }), editUser);

export default router;
