import cloudinary from "../cloudinary";
import AppError from "../errors/AppError";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
import prisma from "../prisma";
import fs from "fs";
const getNews = AsyncErrorHandler(async (req, res, next) => {
	const news = await prisma.news.findMany({
		where: { authorId: req.user?.id },
	});

	res.status(200).json({
		status: "success",
		data: news.map((news) => {
			return {
				id: news.id,
				title: news.title,
				description: news.description,
				newsImage: news.newsImage,
				isPublished: news.isPublished,
			};
		}),
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

	const { title, description, content, section, subSection } = req.data;
	console.log(req.data);

	const news = await prisma.news.create({
		data: {
			title,
			description,
			content,
			isPublished: true,
			authorId: req.user?.id || "",
			publishedAt: new Date().toISOString(),
			newsImage: url,
			section,
			subSection,
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
			isPublished: news.isPublished,
		},
	});
});

const getNewsById = AsyncErrorHandler(async (req, res, next) => {
	const { id } = req.params;

	const { userId } = req.query;
	let isLiked = false;

	if (!id) throw new AppError("Please use an id", 400);
	const news = await prisma.news.findUnique({ where: { id: id } });

	if (!news) throw new AppError("Could not find a news for this id", 404);

	const likes = await prisma.like.findMany({ where: { newsId: news?.id } });

	let like;
	if (userId) {
		like = await prisma.like.findFirst({
			where: { newsId: id, userId: userId + "" },
		});

		if (like) isLiked = true;
	}

	const comments = await prisma.comment.findMany({
		where: { newsId: id },
	});

	res.status(200).json({
		status: "success",
		data: {
			...news,
			likes: likes.length,
			isLiked,
			likeId: isLiked ? like?.id : "",
			comments,
		},
	});
});

const likeNews = AsyncErrorHandler(async (req, res, next) => {
	const { id } = req.params;

	if (!req.user) throw new AppError("This route is protected", 400);

	const like = await prisma.like.create({
		data: { userId: req?.user.id, newsId: id },
	});

	if (!like) throw new AppError("An error occured in creating like", 400);

	res.json({ status: "success", message: "Liked succesfully", like });
	return;
});

const unlike = AsyncErrorHandler(async function (req, res) {
	const { id } = req.params;
	console.log(id);

	if (!id) throw new AppError("Please use an id", 400);

	if (!req.user) throw new AppError("This route is protected", 400);

	await prisma.like.delete({ where: { id } });

	res.json({ status: "success", message: "Unliked successfully" });
});

const addComment = AsyncErrorHandler(async function (req, res) {
	const { id: newsId } = req.params;
	const { content } = req.data;

	if (!req.user) throw new AppError("This is a protected route", 403);

	const comment = await prisma.comment.create({
		data: { content, newsId: newsId, name: req.user.name, userId: req.user.id },
	});

	console.log(comment);

	res.status(201).json({ status: "success", data: comment });
});

const getHomeNews = AsyncErrorHandler(async (req, res, next) => {
	const news = await prisma.news.aggregateRaw({
		pipeline: [
			{ $sample: { size: 5 } },
			{ $project: { title: 1, newsImage: 1, section: 1 } }, // Fetch 5 random documents
		],
	});

	res.status(200).json({ status: "success", data: news });
});

const getNewsUnAuth = AsyncErrorHandler(async function (rq, res, next) {
	const news = await prisma.news.findMany({});

	if (!news) throw new AppError("No news found.", 404);

	res.json({ status: "success", news });
});

export {
	getNews,
	saveNewsToDraft,
	publishNews,
	getNewsById,
	likeNews,
	unlike,
	addComment,
	getHomeNews,
	getNewsUnAuth,
};
