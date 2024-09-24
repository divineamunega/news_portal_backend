import { Router } from "express";
import { publishNewsValidator } from "../validators/NewsValidator";
import {
	getNews,
	getNewsById,
	publishNews,
} from "../controllers/NewsController";
import { protect } from "../controllers/AuthController";
import multer from "multer";

const router = Router();

const upload = multer({
	dest: "uploads/",
	limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
	"/",
	protect({ role: "PUBLISHER" }),
	upload.single("newsImage"),
	publishNewsValidator(),
	publishNews
);

router.get("/:id", getNewsById);
router.get("/", protect({ role: "PUBLISHER" }), getNews);
export default router;
