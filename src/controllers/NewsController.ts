import cloudinary from "../cloudinary";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import prisma from "../prisma";
import fs from "fs";
const getNews = AsyncErrorHandler(async (req, res, next) => {
	const news = await prisma.news.findMany({
		where: { authorId: req.user?.id },
	});

	console.log(news);
	res.status(200).json({
		status: "success",
		data: news,
	});
});

const saveNewsToDraft = AsyncErrorHandler(async (req, res, next) => {});

const publishNews = AsyncErrorHandler(async (req, res, next) => {
	// Upload Image
	const upLoadResult = (await cloudinary).uploader.upload(req.file?.path || "");
	const url = (await cloudinary).url((await upLoadResult).public_id);

	fs.unlink(req.file?.path || "", (err) => {
		if (err) throw err;
		console.log("Uploaded image deleted from local");
	});

	const { title, description, content } = req.data;

	const news = await prisma.news.create({
		data: {
			title,
			description,
			content,
			isPublished: true,
			authorId: req.user?.id || "",
			publishedAt: new Date().toISOString(),
			newsImage: url,
		},
	});

	res.json({
		status: "success",
		data: {
			id: news.id,
			title: news.title,
			description: news.description,
			content: news.content,
			newsImage: news.newsImage,
		},
	});
});

export { getNews, saveNewsToDraft, publishNews };
