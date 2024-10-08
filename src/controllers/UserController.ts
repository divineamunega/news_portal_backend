import AppError from "../errors/AppError";
import prisma from "../prisma";
import AsyncErrorHandler from "../errors/AsyncErrorHandler";
const roles = ["ADMIN", "PUBLISHER", "USER"];

const getUsers = AsyncErrorHandler(async (req, res, next) => {
	// const role = req.pa;
	let { role, limit, page } = req.query;

	const take = limit ? (isNaN(+limit) ? 10 : +limit) : 10;
	const skip = (page ? (isNaN(+page) ? 1 : +page) : 1) * take - take;
	let message = "";
	if (!roles.includes(role + "")) {
		role = "";
		message =
			"The only roles allowed are USER PUBLISHER and ADMIN. Anything else will default to USER";
	}

	const numOfUsers = await prisma.user.count({
		where: { role: role ? (role as any) : "USER" },
	});
	if (!numOfUsers) throw new AppError("No user found", 404);

	const noOfPages = Math.ceil(numOfUsers / take);

	const users = await prisma.user.findMany({
		where: { role: role ? (role as any) : "USER" },
		take,
		skip,
		select: { name: true, password: false, email: true, id: true, news: true },
	});

	if (!users) throw new AppError("No user found.", 404);

	res.status(200).json({
		status: "success",
		message: message ? message : undefined,
		noOfPages,
		numOfUsers,
		page: page ? (isNaN(+page) ? 1 : +page) : 1,
		data: users,
		limit: take,
	});
});

const deleteUser = AsyncErrorHandler(async function (req, res, next) {
	const { userId } = req.params;
	await prisma.user.delete({ where: { id: userId } });

	res.status(204).json({ status: "success", message: "deleted" });
});

const editUser = AsyncErrorHandler(async function (req, res, next) {
	const { userId } = req.params;
	const { type } = req.query;

	if (!userId || !type)
		throw new AppError("This route needs id and type parameters", 403);

	const user = await prisma.user.update({
		where: { id: userId },
		data: { role: type === "publisher" ? "USER" : "PUBLISHER" },
	});

	res.status(204).json({ status: "success", data: user });
	return;
});

export { getUsers, deleteUser, editUser };
