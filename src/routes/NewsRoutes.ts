import multer from "multer";
import { Router } from "express";
import { publishNewsValidator } from "../validators/NewsValidator";
import { getNews, publishNews } from "../controllers/NewsController";
import { protect } from "../controllers/AuthController";

const upload = multer({
	dest: "uploads/",
	limits: { fileSize: 1 * 1024 * 1024 },
});

const router = Router();

router.post(
	"/",
	protect({ role: "PUBLISHER" }),
	upload.single("image"),
	publishNewsValidator(),
	publishNews
);
router.get("/", protect({ role: "PUBLISHER" }), getNews);
export default router;
