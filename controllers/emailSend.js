const fileSchema = require("../models/fileSchema");
const emailSchema = require("../models/emailSchema");
const { Keys } = require("../config/config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Keys.SENDGRID_API_KEY);

const htmlGen = async (from, uuid) => {
	return new Promise(async (resolve) => {
		const emailFormat = await emailSchema.findOne({ emailType: "link" });
		let template = emailFormat.template;
		const link = `${Keys.BASE_URL}/files/${uuid}`;
		template = template.replace("${senderEmail}", from);
		template = template.replace("${senderEmail}", from);
		template = template.replace("${link}", link);
		resolve(template);
	});
};

const emailSend = async (req, res) => {
	const { uuid, emailTo, emailFrom, expiresIn } = req.body;
	if (!uuid || !emailTo || !emailFrom) {
		return res
			.status(422)
			.send({ error: "All fields are required except expiry." });
	}
	// Get data from db
	try {
		const file = await fileSchema.findOne({ uuid: uuid });
		file.sender = emailFrom;
		file.receiver = emailTo;
		const response = await file.save();
		const email_template = await htmlGen(emailFrom, uuid);
		const msg = {
			to: emailTo,
			from: Keys.SENDER_EMAIL_ADDRESS,
			subject: `File Sent By ${emailFrom}`,
			text: `A file has been sent to you by ${emailFrom}`,
			html: email_template,
		};
		sgMail.send(msg);
		return res.json({ success: true });
		// send mail
	} catch (err) {
		return res.status(500).send({ error: "Something went wrong." });
	}
};

module.exports = emailSend;
