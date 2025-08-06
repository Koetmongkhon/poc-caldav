const { xmlParser } = require("../../middlewares/xml_parser");

const {
  caldav,
} = global.handlers;
const router = require("express").Router();

// not support LOCK, UNLOCK, COPY, MOVE, MKCOL || MKCALENDAR, AUDIO
router.propfind("/:user", xmlParser, caldav.propfind.bind(caldav));
router.proppatch("/:user/:calId", xmlParser, caldav.proppatch.bind(caldav));
router.options("", caldav.options.bind(caldav));
router.report("/:user/:calId", xmlParser, caldav.report.bind(caldav));
router.report("/:user/:calId/:eventId", xmlParser, caldav.report.bind(caldav));
router.put("/:user/:calId/:eventId", xmlParser, caldav.put.bind(caldav));
router.get("/:user/:calId/:eventId", caldav.get.bind(caldav));
router.delete("/:calId/:eventId", caldav.delete.bind(caldav));
router.delete("/:calId", caldav.delete.bind(caldav));

module.exports = router;
