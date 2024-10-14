import { Router } from "express";
import {
	commentValidator,
	publishNewsValidator,
} from "../validators/NewsValidator";
import {
	addComment,
	deleteNews,
	editNews,
	getHomeNews,
	getNews,
	getNewsById,
	getNewsUnAuth,
	likeNews,
	publishNews,
	unlike,
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

router.get("/", getNewsUnAuth);
router.get("/main", getHomeNews);
router.get("/publisher", protect({ role: "PUBLISHER" }), getNews);
router.put(
	"/:id",
	protect({ role: "PUBLISHER" }),
	upload.single("newsImage"),
	publishNewsValidator(),
	editNews
);
router.get("/:id", getNewsById);
router.delete("/delete/:id", protect({ role: "PUBLISHER" }), deleteNews);
router.post("/like/:id", protect({ role: "USER" }), likeNews);
router.post("/unlike/:id", protect({ role: "USER" }), unlike);
router.post(
	"/comment/:id",
	protect({ role: "USER" }),
	commentValidator(),
	addComment
);
export default router;
