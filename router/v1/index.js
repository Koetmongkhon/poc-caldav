const router = require("express").Router();

router.use("/calendars", require("./calendars"));

module.exports = router;
