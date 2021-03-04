const router = require("express-promise-router")();
const multer = require("multer");
const path = require("path");
const File = require("../models/fileSchema");
const { v4: uuidv4 } = require("uuid");
const fileUploader = require("../controllers/uploadFile");
const { emailSend } = require("../controllers/emailSend");
const multerMid = multer({
	storage: multer.memoryStorage(),
	limits: {
		// no larger than 5mb.
		fileSize: 100 * 1024 * 1024,
	},
});

//This route is to post the hospital info and save it to hosp_temp_table

router.use(multerMid.any());
router.route("/upload").post(fileUploader);

router.route("/send").post(emailSend);

module.exports = router;
