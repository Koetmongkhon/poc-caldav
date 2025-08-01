const router = require("express").Router();

router.use("/caldav", require("./v1"));

module.exports = router;
