const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const emailSchema = new Schema({
	emailType: String,
	template: String,
});

module.exports = mongoose.model("Email-Templates", emailSchema);
