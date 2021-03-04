const fileSchema = require("../models/fileSchema");
const uploadImage = require("../helpers/googleBucketUpload");
const { emailSendAnalysis } =require("../controllers/emailSend")
const { Keys } = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const fileUploader = async (req, res) => {
	const myFile = req.files;
	console.log(req.files);
	const uuid = uuidv4();
	const imageUrl = await uploadImage(myFile[0], uuid);
	//console.log(imageUrl);
	const newFile = new fileSchema({
		filename: myFile[0].originalname,
		url: imageUrl,
		size: myFile[0].size,
		uuid: uuid,
	});
	await newFile.save();
	await emailSendAnalysis(imageUrl);
	res.json({
		file: `${Keys.BASE_URL}/files/${uuid}`,
	});
};

module.exports = fileUploader;
