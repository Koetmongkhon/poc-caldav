const { xmlParser } = require("../../middlewares/xml_parser");

const {
  calendars,
} = global.handlers;
const router = require("express").Router();

router.propfind("", xmlParser, calendars.propfind.bind(calendars));
// router.proppatch();
// router.options();
// router.report();
// // router.makeCalendar();
// router.put();
// router.get();
// router.delete();
// router.move();

module.exports = router;
