const { Keys } = require("../config/config");
const gc = require("../config/gcloud_config");
const bucket = gc.bucket("file_sharing_storage"); // should be your bucket name
const path = require("path");
/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */
const uploadImage = (file, uuid) =>
	new Promise((resolve, reject) => {
		const { fieldname, originalname, buffer } = file;
		console.log("Uploading [" + fieldname + "] to Google Cloud...");
		const exxt = path.extname(originalname);
		const blob = bucket.file(
			originalname.replace(
				originalname,

				uuid + "/" + originalname
			)
		);
		const blobStream = blob.createWriteStream({
			resumable: false,
		});
		blobStream
			.on("finish", () => {
				const publicUrl = `${Keys.GOOGLE_STORAGE_URL}/${bucket.name}/${blob.name}`;
				console.log("Uploaded [" + fieldname + "] to Google Cloud");
				resolve(publicUrl);
			})
			.on("error", (error) => {
				console.log(
					"Error while uploading " + fieldname + " to Google Cloud"
				);
				reject(error);
			})
			.end(buffer);
	});
module.exports = uploadImage;
