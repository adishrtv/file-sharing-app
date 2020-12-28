const router = require("express-promise-router")();
const scheduleTask = require("../controllers/scheduleTask");

router.route("/schedular").get(scheduleTask);

module.exports = router;
