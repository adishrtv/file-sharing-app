const File = require("../models/fileSchema");
const { Keys } = require("../config/config");
const gc = require("../config/gcloud_config");
const bucket = gc.bucket("file_sharing_storage");

const scheduleTask = async (req, res) => {
	const files = await File.find({
		createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
	});
	if (files.length) {
		for (let i = 0; i < files.length; i++) {
			try {
				const filename = files[i].url;
				const res = filename.split("file_sharing_storage/");
				console.log(res);
				await bucket.file(res[1]).delete();
				console.log(`successfully deleted ${filename}`);
				await files[i].remove();
			} catch (err) {
				console.log(`error while deleting file ${err} `);
			}
		}
	}
	console.log("Job done!");
	res.status(200).json({ success: "Job done!" });
};

module.exports = scheduleTask;
