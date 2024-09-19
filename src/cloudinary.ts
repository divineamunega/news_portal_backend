import { v2 as cloudinary } from "cloudinary";

export default (async function () {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	return cloudinary;
})();
