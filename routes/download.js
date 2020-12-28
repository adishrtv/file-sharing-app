const router = require("express").Router();
const File = require("../models/fileSchema");

router.get("/:uuid", async (req, res) => {
	// Extract link and get file from storage send download stream
	const file = await File.findOne({ uuid: req.params.uuid });
	// Link expired
	if (!file) {
		return res.render("download", { error: "Link has been expired." });
	}
	res.header("Content-Type", "application/octet-stream");
	//res.status(200).json({ url: file.url });
	res.status(200).redirect(file.url);
});

module.exports = router;
