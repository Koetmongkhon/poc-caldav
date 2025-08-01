const { xmlParser } = require("../../middlewares/xml_parser");

const {
  calendars,
} = global.handlers;
const router = require("express").Router();

// not support LOCK, UNLOCK, COPY, MOVE, MKCOL || MKCALENDAR, AUDIO
router.propfind("", xmlParser, calendars.propfind.bind(calendars));
// router.proppatch();
router.options("", calendars.options.bind(calendars));
router.report("/:calId", xmlParser, calendars.report.bind(calendars));
// router.put();
router.get("/:calId/:eventId", calendars.get.bind(calendars));
// router.delete();

module.exports = router;
