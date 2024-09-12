import crypto from "crypto";
import prisma from "../prisma";

function generateJoinCode(length = 6) {
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let code = "";
	const bytes = crypto.randomBytes(length);
	for (let i = 0; i < length; i++) {
		code += chars[bytes[i] % chars.length];
	}
	return code;
}

async function createUniqueJoinCode() {
	let unique = false;
	let joinCode = "";

	while (!unique) {
		joinCode = generateJoinCode();
		const existingQuiz = await prisma.quiz.findFirst({
			where: { joinCode: { not: { equals: undefined }, equals: joinCode } },
		});
		if (!existingQuiz) {
			unique = true;
		}
	}

	return joinCode;
}

export { createUniqueJoinCode };
