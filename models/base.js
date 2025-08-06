const ics = require("ics");
const ical2json = require("ical2json");
const moment = require("moment");
const u = require("lodash");
const hash = require("object-hash");

class Base {
  constructor(config) {
    this.config = config;
  }

  parseHrefToIcsId(href) {
    var e = href.split("/");
    var id = e[e.length - 1];

    return id.substr(0, id.length - 4);
  }

  icsToEvent(data) {
    /*
      return {
        id: result.id,
        name: result.subject,
        start: startDate.getTime(),
        end: endDate.getTime(),
        isAllDay: result.isAllDay,
        attendees: attendees,
        recurrence: result.recurrence,
      }
    */
    const _data = ical2json.convert(data);

    let { VCALENDAR: _calendar } = _data;
    _calendar = _calendar[0];
    let event = _calendar.VEVENT[0];
    if (!event)
      throw Error("invalid ics format");

    let timezone = "Asia/Bangkok";
    if (event.TZID)
      timezone = event.TZID;
    let start = event[`DTSTART;TZID=${timezone}`] || event["DTSTART"];
    let end = event[`DTEND;TZID=${timezone}`] || event["DTEND"];
    if (start) {
      start = moment(start);
      start = start.unix() + "000";
    }
    if (end) {
      end = moment(end);
      end = end.unix() + "000";
    }
    // organizer
    // TODO: if (ORGANIZER)

    // attendees
    let attendees;
    if (event.DTSTAMP) {
      attendees = [];
      const tempAtt = event.DTSTAMP.split(";");
      tempAtt.forEach(r => {
        if (r.includes("EMAIL=")) {
          attendees.push(r.replace("EMAIL=", ""));
        }
      });
    }

    let recurrence;
    if (event.RRULE)
      recurrence = event.RRULE;

    return {
      id: event["UID"],
      name: event["SUMMARY"],
      start,
      end,
      isAlDay: event["DTEND;VALUE=DATE"] ? true : false,
      attendees,
      recurrence,
    };
  }

  getParticipants(data) {
    let organizer;
    const attendees = [];
    if (data.attendees == null || data.attendees == undefined)
      return {
        organizer,
        attendees,
      }
    data.attendees.forEach((user) => {
      if (!u.isEmpty(user.email)) {
        if (user.isOrganizer) {
          organizer = {
            name: `"${(user.name || user.email).replace(/"/g, '')}"`,
            email: user.email
          }
        }
        attendees.push({
          name: `"${(user.name || user.email).replace(/"/g, '')}"`,
          email: user.email,
          role: Reservation.getRoleString(user.role),
          rsvp: user.rsvp || undefined,
          partstat: Reservation.getJoinStateString(user.joinState),
        });
      }
    });
    return {
      organizer,
      attendees,
    };
  }

  /*
    {
      id: "",
      name: "",
      startDateTime: 1754473680000,
      endDateTime: 1754477280000,
      attendees: [
        {
          id: "",
          name: null || "",
          email: null || "",
          role: null,
          rsvp: null,
          joinState: 0,
          isOrganizer: true,
          comment: null
        }
      ],
      isAllDay: false,
      creator: '10498',
      link_event_id: null,
      state: 'resource_1618825725204',
      createdDate: 1754388440520,
      rrule: null,
      rruleType: null,
      group: null,
      type: 'Resource'
    }
  */
  async toIcs(event) {
    const participants = this.getParticipants(event);
    const input = {
      uid: event.id,
      title: event.name,
      productId: `caldav/ics`,
      start: event.startDateTime,
      end: event.endDateTime,
      // location: _data.location,
      organizer: participants.organizer,
      attendees: participants.attendees, // mock
      // sequence: _data.version,
    }

    if (event.rrule)
      input.recurrenceRule = event.rrule;

    return new Promise((resolve, reject) => {
      ics.createEvents([input], (err, value) => {
        if (err) {
          console.log(err);
          return reject(err)
        }
        return resolve(value);
      });
    });
  }

  eTag(event) {
    const participants = this.getParticipants(event);
    const input = {
      uid: event.id,
      title: event.name,
      productId: `caldav/ics`,
      start: event.startDateTime,
      end: event.endDateTime,
      // location: _data.location,
      organizer: participants.organizer,
      attendees: participants.attendees, // mock
      // sequence: _data.version,
    }
    return hash.MD5(input);
  }
}

module.exports = Base;
