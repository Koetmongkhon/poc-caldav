const moment = require("moment");
const { encodeHTML } = require("../utils/utils");
const { getXMLHead } = require("../utils/xml");
const Base = require("./base");

class Calendars extends Base {
  constructor(config) {
    super(config);
  };

  _isCheckSum(xmlDoc) {
    const nodeChecksum = xmlDoc.get("/A:propfind/A:prop/C:checksum-versions", {
      A: "DAV:",
      B: "urn:ietf:params:xml:ns:caldav",
      C: "http://calendarserver.org/ns/",
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    return nodeChecksum !== undefined && nodeChecksum !== null;
  }

  _getCalendarRootNodeResponse(ctx, children, isAll) {
    const { user: owner } = ctx;
    let response = "";

    response += "<d:response><d:href>" + ctx.path + "</d:href>";
    response += "<d:propstat>";
    response += "<d:prop>";

    if (isAll) {
      response += "<d:owner><d:href>" + "/caldav/p/" + owner + "/</d:href></d:owner>";
      response += "<d:resourcetype><d:collection/></d:resourcetype>";
    } else {
      const len = children.length;
      for (let i = 0; i < len; ++i) {
        const child = children[i];
        const name = child.name();
        switch (name) {
          // case "current-user-privilege-set":
          //   response += getCurrentUserPrivilegeSet();
          //   break;

          case "owner":
            response += "<d:owner><d:href>" + "/caldav/p/" + owner + "/</d:href></d:owner>";
            break;

          case "resourcetype":
            response += "<d:resourcetype><d:collection/></d:resourcetype>";
            break;

          // case "supported-report-set":
          //   response += getSupportedReportSet(true);
          //   break;
        }
      }
    }

    response += "</d:prop>";
    response += "<d:status>HTTP/1.1 200 OK</d:status>";
    response += "</d:propstat>";
    response += "</d:response>";

    return response;
  }

  _getSupportedReportSet(isRoot) {
    var response = "";

    response += "<d:supported-report-set>";

    if (!isRoot) {
      response += "<d:supported-report><d:report><cal:calendar-multiget/></d:report></d:supported-report>";
      response += "<d:supported-report><d:report><cal:calendar-query/></d:report></d:supported-report>";
      response += "<d:supported-report><d:report><cal:free-busy-query/></d:report></d:supported-report>";
    }

    response += "<d:supported-report><d:report><d:sync-collection/></d:report></d:supported-report>";
    response += "<d:supported-report><d:report><d:expand-property/></d:report></d:supported-report>";
    response += "<d:supported-report><d:report><d:principal-property-search/></d:report></d:supported-report>";
    response += "<d:supported-report><d:report><d:principal-search-property-set/></d:report></d:supported-report>";
    response += "</d:supported-report-set>";

    return response;
  }

  _returnPropfindElements(ctx, calendar, children, isAll, callback) {
    const { user: owner } = ctx;
    let response = "";

    const token = "SYNC-TOKEN";

    if (isAll) {
      response += "<xical:calendar-color xmlns:xical=\"http://apple.com/ns/ical/\" symbolic-color=\"custom\">" + "#FFFFFF" + "</xical:calendar-color>";

      if (calendar.description)
        response += "<cal:calendar-description>" + calendar.description + "</cal:calendar-description>";

      response += "<cal:calendar-timezone>" + encodeHTML("Asia/Bangkok") + "</cal:calendar-timezone>";
      response += "<d:displayname>" + encodeHTML(calendar.displayname) + "</d:displayname>";
      response += "<d:owner><d:href>" + "/caldav/p/" + owner + "/</d:href></d:owner>";
      response += "<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>";
      response += "<cal:schedule-calendar-transp><cal:opaque/></cal:schedule-calendar-transp>";
      response += "<d:sync-token>\"" + token + "\"</d:sync-token>";
    } else {
      const len = children.length;
      for (let i = 0; i < len; ++i) {
        const child = children[i];
        const name = child.name();
        switch (name) {
          // case "add-member":
          //     response += "";
          //     break;

          // case "allowed-sharing-modes":
          //   response += "<cs:allowed-sharing-modes><cs:can-be-shared/><cs:can-be-published/></cs:allowed-sharing-modes>";
          //   break;

          // case "autoprovisioned":
          //     response += "";
          //     break;

          // case "bulk-requests":
          //     response += "";
          //     break;

          case "calendar-color":
            response += "<xical:calendar-color xmlns:xical=\"http://apple.com/ns/ical/\" symbolic-color=\"custom\">" + "#FFFFFF" + "</xical:calendar-color>";
            break;

          case "calendar-description":
            if (calendar.description)
              response += "<cal:calendar-description>" + calendar.description + "</cal:calendar-description>";
            break;

          // case "calendar-free-busy-set":
          //     response += "";
          //     break;

          // case "calendar-order":
          //   if (!calendar.order)
          //     calendar.order = 1;
          //   response += "<cal:calendar-order>" + calendar.order + "</cal:calendar-order>";
          //   response += "<xical:calendar-order xmlns:xical=\"http://apple.com/ns/ical/\">" + calendar.order + "</xical:calendar-order>";
          //   break;

          case "calendar-timezone":
            const timezone = "Asia/Bangkok";
            // if (timezone)
            //   timezone = timezone.replace(/\r\n|\r|\n/g, "&#13;\r\n");
            // else
            //   timezone = "";

            response += "<cal:calendar-timezone>" + timezone + "</cal:calendar-timezone>";
            break;

          // case "current-user-privilege-set":
          //   response += getCurrentUserPrivilegeSet();
          //   break;

          // case "default-alarm-vevent-date":
          //     response += "";
          //     break;

          // case "default-alarm-vevent-datetime":
          //     response += "";
          //     break;

          case "displayname":
            response += "<d:displayname>" + encodeHTML(calendar.displayname) + "</d:displayname>";
            break;

          // case "language-code":
          //     response += "";
          //     break;

          // case "location-code":
          //     response += "";
          // break;

          case "owner":
            response += "<d:owner><d:href>" + "/caldav/p/" + owner + "/</d:href></d:owner>";
            break;

          // TODO Fix URL
          // case "pre-publish-url":
          //     response += "<cs:pre-publish-url><d:href>https://127.0.0.1/cal/" + username + "/" + calendar.pkey + "</d:href></cs:pre-publish-url>";
          //     break;

          // case "publish-url":
          //     response += "";
          //     break;

          // case "push-transports":
          //     response += "";
          //     break;

          // case "pushkey":
          //     response += "";
          //     break;

          // case "quota-available-bytes":
          //     response += "";
          //     break;

          // case "quota-used-bytes":
          //     response += "";
          //     break;

          // case "refreshrate":
          //     response += "";
          //     break;

          // case "resource-id":
          //     response += "";
          //     break;

          case "resourcetype":
            response += "<d:resourcetype><d:collection/><cal:calendar/></d:resourcetype>";
            break;

          case "schedule-calendar-transp":
            response += "<cal:schedule-calendar-transp><cal:opaque/></cal:schedule-calendar-transp>";
            break;

          // case "schedule-default-calendar-URL":
          //     response += "";
          //     break;

          // case "source":
          //     response += "";
          //     break;

          // case "subscribed-strip-alarms":
          //     response += "";
          //     break;

          // case "subscribed-strip-attachments":
          //     response += "";
          //     break;

          // case "subscribed-strip-todos":
          //     response += "";
          //     break;

          case "supported-calendar-component-set":
          case "supported-calendar-component-sets":
            response += "<cal:supported-calendar-component-set><cal:comp name=\"VEVENT\"/></cal:supported-calendar-component-set>";
            break;

          case "supported-report-set":
            response += this._getSupportedReportSet(false);
            break;

          case "getctag":
            response += "<cs:getctag>\"" + token + "\"</cs:getctag>";
            break;

          // case "getetag":
          // no response?
          //response += "<d:getetag>http://swordlord.com/ns/sync/" + token + "</d:getetag>";
          // isGetEvent = true;
          // break;

          // case "checksum-versions":
          // no response?
          // break;

          case "sync-token":
            response += "<d:sync-token>\"" + token + "\"</d:sync-token>";
            break;

          // case "acl":
          //   response += getACL(comm);
          //   break;

          // case "getcontenttype":
          //response += "<d:getcontenttype>text/calendar;charset=utf-8</d:getcontenttype>";
          // break;

          default:
            if (name != "text") console.log("CAL-PF: not handled: " + name);
            break;
        }
      }
    }

    if (callback) {
      callback(response);
    }
    return response;
  }

  _returnCalendar(ctx, calendar, children, isAll) {
    let response = "";

    response += "	<d:response>";
    response += "		<d:href>" + `${ctx.path.endsWith("/") ? ctx.path : ctx.path + "/"}` + calendar.pkey + "/</d:href>";
    response += "		<d:propstat>";
    response += "			<d:prop>";

    response += this._returnPropfindElements(ctx, calendar, children, isAll);

    response += "			</d:prop>";
    response += "			<d:status>HTTP/1.1 200 OK</d:status>";
    response += "		</d:propstat>";
    response += "	</d:response>";

    return response;
  }

  propfind(ctx, xmlDoc, isAll) {
    console.log("request propfind:", isAll);
    let response = getXMLHead();
    if (this._isCheckSum(xmlDoc)) {
      console.log("get summary");
      response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\">";
      response += "<d:response><d:href>" + ctx.path + "</d:href></d:response>";
      response += "</d:multistatus>";
      return response;
    }

    let children;
    if (!isAll) {
      const node = xmlDoc.get("/A:propfind/A:prop", {
        A: "DAV:",
        B: "urn:ietf:params:xml:ns:caldav",
        C: "http://calendarserver.org/ns/",
        D: "http://apple.com/ns/ical/",
        E: "http://me.com/_namespace/"
      });
      children = node.childNodes();
    }

    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\">";
    response += this._getCalendarRootNodeResponse(ctx, children, isAll);

    const calendars = [
      {
        pkey: "CALENDAR_1",
        description: "CAL_1_description",
        displayname: "cal-1",
      },
      {
        pkey: "CALENDAR_2",
        description: "CAL_2_description",
        displayname: "cal-2",
      },
    ];
    calendars.forEach(c => {
      response += this._returnCalendar(ctx, c, children, isAll);
    });
    response += "</d:multistatus>";
    return response;
  };

  proppatch(ctx, xmlDoc) {
    let response = getXMLHead();
    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\" xmlns:ical=\"http://apple.com/ns/ical/\">\r\n";
    response += "	<d:response>\r\n";
    response += "		<d:href>" + ctx.path + "</d:href>\r\n";
    response += "		<d:propstat>\r\n";
    response += "			<d:prop>\r\n";

    const node = xmlDoc.get('/A:propertyupdate/A:set/A:prop', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    const childs = node.childNodes();

    const cal = {};
    childs.forEach(c => {
      var name = c.name();
      switch (name) {
        case 'default-alarm-vevent-date':
          response += "<cal:default-alarm-vevent-date/>";
          break;

        case 'default-alarm-vevent-datetime':
          response += "<cal:default-alarm-vevent-datetime/>";
          break;

        case 'displayname':
          response += "<cal:displayname>" + c.text() + "</cal:displayname>";
          cal.displayname = c.text();
          break;

        case 'calendar-timezone':
          response += "<cal:calendar-timezone/>";
          cal.timezone = c.text();
          break;

        case 'calendar-color':
          response += "<ical:calendar-color>" + c.text() + "</ical:calendar-color>";
          cal.colour = c.text();
          break;

        case 'calendar-order':
          response += "<ical:calendar-order/>";
          cal.order = c.text();
          break;

        default:
          if (name != 'text') log.warn("CAL-PP: not handled: " + name);
          break;
      }
    });
    response += "			</d:prop>\r\n";
    response += "			<d:status>HTTP/1.1 200 OK</d:status>\r\n";
    response += "		</d:propstat>\r\n";
    response += "	</d:response>\r\n";
    response += "</d:multistatus>\r\n";

    // TODO: update calendar
    return response;
  };

  _returnEvent(calendar, event, props) {
    let response = "";
    props.forEach(child => {
      const name = child.name();
      switch (name) {
        case "getetag":
          response += "<d:getetag>\"" + `ETAG-${event.id}` + "\"</d:getetag>";
          break;

        case "getcontenttype":
          if (calendar.supported_cal_component)
            response += "<d:getcontenttype>text/calendar; charset=utf-8; component=" + calendar.supported_cal_component + "</d:getcontenttype>";
          break;

        case "calendar-data":
          // TODO: change event into ics
          response += "<cal:calendar-data>" + `<BEGIN>${JSON.stringify(event)}</BEGIN>` + "</cal:calendar-data>"; // has to be cal: since a few lines below the namespace is cal: not c:
          break;

        default:
          if (name != "text") console.log("P-R: not handled: " + name);
          break;
      }
    });
    return response;
  }

  _returnEvents(ctx, calendar, events, props) {
    let response = "";
    events.forEach(event => {
      response += "<d:response><d:href>" + `${ctx.path.endsWith("/") ? ctx.path : ctx.path + "/"}` + event.id + ".ics</d:href>";
      response += "<d:propstat>";
      response += "<d:prop>";

      response += this._returnEvent(calendar, event, props);

      response += "</d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat>";
      response += "</d:response>";
    });
    response += "</d:multistatus>";
    return response;
  }

  calendarQuery(ctx, xmlDoc) {
    const filter = { calendarId: ctx.calId };
    let response = getXMLHead();
    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\" xmlns:ical=\"http://apple.com/ns/ical/\">\r\n";

    // find filter in xml
    const nodeFilter = xmlDoc.get(`/B:calendar-query/B:filter/B:comp-filter[@name = "VCALENDAR"]/B:comp-filter[@name = "VEVENT"]/B:time-range`, {
      A: "DAV:",
      B: "urn:ietf:params:xml:ns:caldav",
      C: "http://calendarserver.org/ns/",
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    if (nodeFilter) {
      const attrs = nodeFilter.attrs();
      attrs.forEach(attr => {
        switch (attr.name()) {
          case "start":
            const filterStart = moment(attr.value());
            filter.startDate = filterStart.unix() + "000";
            break;

          case "end":
            const filterEnd = moment(attr.value());
            filter.endDate = filterEnd.unix() + "000";
            break;

          default:
            break;
        }
      });
    }
    console.log(filter);

    const user = "USERNAME";
    // TODO: get calendar from db
    /*
      {
        id: "",
        name: "",
        type: "",
      }
    */
    const calendar = {
      id: "CAL1",
      name: "cal_1",
      type: "RESOURCE",
    }
    calendar.supported_cal_component = "VEVENT";
    // TODO: get events from db
    /*
      [
        {
          id: "",
          name: "",
          start: 1234,
          end: 1234,
          isAllDay: true,
          attendees: []{
            id: "",
            email: "",
          },
          creator: "",
        }
      ]
    */
    const events = [
      {
        id: "EVENT1",
        name: "event_1",
        start: 1753951657000,
        end: 1753951659000,
        isAllDay: false,
        creator: user,
      },
      {
        id: "EVENT2",
        name: "event_2",
        start: 1753952657000,
        end: 1753952659000,
        isAllDay: false,
        creator: user,
      },
      {
        id: "EVENT3",
        name: "event_3",
        start: 1753953657000,
        end: 1753953659000,
        isAllDay: false,
        creator: user,
      }
    ];

    const nodeProp = xmlDoc.get("/B:calendar-query/A:prop", {
      A: "DAV:",
      B: "urn:ietf:params:xml:ns:caldav",
      C: "http://calendarserver.org/ns/",
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });
    const props = nodeProp.childNodes();

    response += this._returnEvents(ctx, calendar, events, props);
    return response;
  }

  calendarMultiget(ctx, xmlDoc) {
    let response = getXMLHead();
    response += "<d:multistatus xmlns:d=\"DAV:\" xmlns:cal=\"urn:ietf:params:xml:ns:caldav\" xmlns:cs=\"http://calendarserver.org/ns/\" xmlns:card=\"urn:ietf:params:xml:ns:carddav\" xmlns:ical=\"http://apple.com/ns/ical/\">\r\n";
    const user = "USERNAME";

    const node = xmlDoc.get('/B:calendar-multiget', {
      A: 'DAV:',
      B: "urn:ietf:params:xml:ns:caldav",
      C: 'http://calendarserver.org/ns/',
      D: "http://apple.com/ns/ical/",
      E: "http://me.com/_namespace/"
    });

    const arrHrefs = [];
    let props = [];
    if (node) {
      const children = node.childNodes();
      children.forEach(child => {
        const name = child.name();
        switch (name) {
          case 'prop':
            props = child.childNodes();
            break;

          case 'href':
            arrHrefs.push(this.parseHrefToIcsId(child.text()));
            break;

          default:
            if (name != 'text') console.log("P-R: not handled: " + name);
            break;
        }
      });
    }
    console.log("id:", arrHrefs);
    console.log("props:", props);

    // TODO: get events from db by arrHrefs
    /*
      [
        {
          id: "",
          name: "",
          start: 1234,
          end: 1234,
          isAllDay: true,
          attendees: []{
            id: "",
            email: "",
          },
          creator: "",
        }
      ]
    */
    const events = [
      {
        id: "EVENT1",
        name: "event_1",
        start: 1753951657000,
        end: 1753951659000,
        isAllDay: false,
        creator: user,
      },
      {
        id: "EVENT2",
        name: "event_2",
        start: 1753952657000,
        end: 1753952659000,
        isAllDay: false,
        creator: user,
      },
      {
        id: "EVENT3",
        name: "event_3",
        start: 1753953657000,
        end: 1753953659000,
        isAllDay: false,
        creator: user,
      }
    ];
    response += this._returnEvents(ctx, { id: ctx.calId }, events, props)
    return response;
  }

  delete(user, calId) {
    console.log("delete calendar");
    // TODO: delete event;
    return;
  }
};

module.exports = Calendars;
