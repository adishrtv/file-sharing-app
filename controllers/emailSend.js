const fileSchema = require("../models/fileSchema");
const emailSchema = require("../models/emailSchema");
const { Keys } = require("../config/config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(Keys.SENDGRID_API_KEY);

const htmlGen = async (type, from, uuid, fileUrl) => {
	return new Promise(async (resolve) => {
		const emailFormat = await emailSchema.findOne({ emailType: type });
		let template = emailFormat.template;
		if(type === 'link'){
		const link = `${Keys.BASE_URL}/files/${uuid}`;
			template = template.replace("${senderEmail}", from);
			template = template.replace("${senderEmail}", from);
			template = template.replace("${link}", link);
			resolve(template);
		} else {
			template = template.replace("${fileUrl}", fileUrl);
			template = template.replace("${time}", new Date());
			resolve(template);
		}
	});
};

const emailSendAnalysis = async (fileUrl) => {
	try {
		const email_template = await htmlGen('analysis', Keys.SENDER_EMAIL_ADDRESS, 'default', fileUrl);
		const msg = {
			to: 'adityashrtv1111@gmail.com',
			from: Keys.SENDER_EMAIL_ADDRESS,
			subject: `New File Upload at ${new Date()}`,
			text: `A file has been uploaded.`,
			html: email_template,
		};
		sgMail.send(msg);
		return { success: true };
	} catch (err) {
		console.log(err)
		return { error: "Something went wrong." };
	}
}

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
		const email_template = await htmlGen('link', emailFrom, uuid, 'default');
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

module.exports = { emailSend, emailSendAnalysis };
