const express = require("express")
const app = express()

// use the express-static middleware

// define the first route
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

app.use(express.static("public"))

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));