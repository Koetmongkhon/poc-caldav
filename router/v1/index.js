const router = require("express").Router();

router.use("/calendars", require("./caldav"));

module.exports = router;
