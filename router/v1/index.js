const router = require("express").Router();

router.use("/cal", require("./caldav"));
router.use("/p", require("./principal"));

module.exports = router;
