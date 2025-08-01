const { xmlParser } = require("../../middlewares/xml_parser");

const {
  caldav,
} = global.handlers;
const router = require("express").Router();

// not support LOCK, UNLOCK, COPY, MOVE, MKCOL || MKCALENDAR, AUDIO
router.propfind("", xmlParser, caldav.propfind.bind(caldav));
// router.proppatch();
router.options("", caldav.options.bind(caldav));
router.report("/:calId", xmlParser, caldav.report.bind(caldav));
// router.put();
router.get("/:calId/:eventId", caldav.get.bind(caldav));
router.delete("/:calId/:eventId", caldav.delete.bind(caldav));
router.delete("/:calId", caldav.delete.bind(caldav));

module.exports = router;
