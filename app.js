require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 8080;
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { Keys } = require("./config/config");
const session = require("express-session");
const bodyParser = require("body-parser");

app.use(
	session({
		secret: Keys.EXPRESS_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(express.json());

//Connecting to MongoDB
mongoose.connect(Keys.MongodbURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.once("open", function () {
	console.log("Connected to Database");
});

db.on("error", function (err) {
	if (err) console.log(err);
});

// app.get("/schedule", function (req, res) {
// 	if (req.session.page_s) {
// 		req.session.page_s++;
// 		res.send("You visited this page " + req.session.page_s + " times");
// 	} else {
// 		req.session.page_s = 1;
// 		res.send("Welcome to this page for the first time!");
// 	}
// });

app.get("/favicon.ico", (req, res) => res.status(204));

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes

app.all('*', (req, res, next) => {
    console.log('Before processing - ', req.url, req.method);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.header('Strict-Transport-Security', 'maxAge=100000');
    res.header('X-Frame-Options', 'DENY');
    res.header('Content-Security-Policy', "frame-ancestors 'none'");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Cookies, cookies, x-access-token, Origin, Content-Type, Accept');
    return next();
  });
app.get("/", function (req, res) {
	res.send("Hello World");
});
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/download"));
app.use("/schedule", require("./routes/schedule"));

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
