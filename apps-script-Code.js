
/*
 * BEAN MACHINE - GOOGLE APPS SCRIPT BACKEND • V5 ADVANCED
 *
 * GitHub Pages -> this Web App -> Google Sheets -> Discord Webhook
 *
 * Script Properties required:
 *   SPREADSHEET_ID
 *   ADMIN_PIN
 *
 * Discord webhook properties (recommended):
 *   DISCORD_WEBHOOK_APPLICATIONS
 *   DISCORD_WEBHOOK_REVIEWS
 *   DISCORD_WEBHOOK_COMPLAINTS
 *   DISCORD_WEBHOOK_APPLICATION_STATUS
 *   DISCORD_WEBHOOK_CONTACT
 *   DISCORD_WEBHOOK_NEWSLETTER
 *   DISCORD_WEBHOOK_GENERAL
 *
 * DISCORD_WEBHOOK_URL remains supported as a fallback for older setups.
 *
 * Never put DISCORD_WEBHOOK_URL or ADMIN_PIN in GitHub files.
 */

const SHEETS = {
  Applications: [
    "Timestamp","Name (in city)","Phone","CID","Discord Username",
    "Family Name","Flexible Hours","Follow Company Rules","Source","Status"
  ],
  Reviews: [
    "Timestamp","Employee","Rating","Reviewer Name","Reviewer Discord",
    "Feedback Type","Message","Status","Moderation Token"
  ],
  Employees: [
    "Name","Rank","Photo","Bio","Active"
  ],
  EmployeeOfMonth: [
    "Month","Name","Rank","Photo","Message","Highlight","Timestamp"
  ],
  Announcements: [
    "Date","Title","Message","Active"
  ],
  Events: [
    "Date","Time","Title","Location","Description","Active"
  ],
  Menu: [
    "Name","Price","Image","Description","Active"
  ],
  Gallery: [
    "Title","Image","Active"
  ],
  PriorityCustomers: [
    "Name","Tier","Photo","Offer","Benefits","Ticket ID","Valid Until","Status","Featured","Timestamp"
  ],
  PriorityOffers: [
    "Title","Description","Tier","Discount","Valid Until","Active","Timestamp"
  ],
  Awards: [
    "Date","Name","Rank","Award","Photo","Description","Active","Timestamp"
  ],
  Settings: [
    "Key","Value"
  ]
};

function props_() {
  return PropertiesService.getScriptProperties();
}

function sheet_() {
  const id = props_().getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Missing SPREADSHEET_ID Script Property.");
  return SpreadsheetApp.openById(id);
}

function setupBeanMachineSheet() {

  const ss = sheet_();

  Object.keys(SHEETS).forEach(name => {

    let sh = ss.getSheetByName(name);

    if (!sh) sh = ss.insertSheet(name);

    if (sh.getLastRow() === 0) {
      sh.appendRow(SHEETS[name]);
      sh.setFrozenRows(1);
    } else {
      const currentHeaders = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
      SHEETS[name].forEach(header => {
        if (currentHeaders.indexOf(header) === -1) {
          sh.getRange(1, sh.getLastColumn() + 1).setValue(header);
          currentHeaders.push(header);
        }
      });
    }

  });

  const settings = ss.getSheetByName("Settings");

  const defaults = {
    notifyApplications: "true",
    notifyReviews: "true",
    notifyContact: "true",
    notifyNewsletter: "true",
    maintenanceEnabled: "false",
    maintenanceMessage: "Bean Machine website is currently under maintenance."
  };

  const existing = readSheetObjects_(settings);

  Object.keys(defaults).forEach(key => {

    if (!existing.some(x => x.Key === key)) {
      settings.appendRow([key, defaults[key]]);
    }

  });

}

function readSheetObjects_(sheetNameOrSheet) {

  const sh = typeof sheetNameOrSheet === "string"
    ? sheet_().getSheetByName(sheetNameOrSheet)
    : sheetNameOrSheet;

  if (!sh || sh.getLastRow() < 2) return [];

  const values = sh.getDataRange().getValues();
  const headers = values[0];

  return values.slice(1).map((row, index) => {

    const obj = {
      _row: index + 2
    };

    headers.forEach((header, i) => {
      obj[header] = row[i];
    });

    return obj;

  });

}

function setting_(key, fallback) {

  const sh = sheet_().getSheetByName("Settings");

  if (!sh) return fallback;

  const rows = readSheetObjects_(sh);

  const row = rows.find(x => x.Key === key);

  return row ? String(row.Value) : fallback;

}

function boolSetting_(key, fallback) {

  return String(setting_(key, fallback ? "true" : "false")).toLowerCase() === "true";

}

function doGet(e) {

  try {

    const action = (e.parameter.action || "public").toLowerCase();

    if (action === "public") {
      return json_(publicData_());
    }

    if (action === "moderate_review_link") {
      return moderateReviewLink_(e.parameter.row, e.parameter.status, e.parameter.token);
    }

    // Public application fallback: accepts GET so the browser can submit
    // without relying on cross-origin POST/no-cors behavior.
    if (action === "job_application") {
      return handleApplication_(e.parameter);
    }

    if (action === "admin") {
      return adminData_(e.parameter.token || e.parameter.pin || "");
    }

    if (action === "verify_priority") {
      return verifyPriority_(e.parameter.ticket || "");
    }

    if (action === "test_webhook") {
      requireAdmin_(e.parameter.pin || "");
      const type = String(e.parameter.type || "APPLICATIONS").toUpperCase();
      const allowedTypes = ["APPLICATIONS", "REVIEWS", "COMPLAINTS", "APPLICATION_STATUS", "CONTACT", "NEWSLETTER", "GENERAL"];
      if (allowedTypes.indexOf(type) === -1) {
        return json_({ok:false, error:"Invalid webhook type."});
      }
      const result = notifySimple_("🧪 Bean Machine Webhook Test", "This is a test notification from the Bean Machine website.", type);
      return json_(result);
    }

    return json_({
      ok: false,
      error: "Unknown action."
    });

  } catch (error) {

    console.error(error);

    return json_({
      ok: false,
      error: String(error)
    });

  }

}

function publicData_() {

  const employees = readSheetObjects_("Employees")
    .filter(x => String(x.Active).toLowerCase() !== "false");

  const reviews = readSheetObjects_("Reviews")
    .filter(x => String(x.Status).toLowerCase() === "approved");

  const employeeNames = employees.map(x => x.Name);

  const reviewStats = employeeNames.map(name => {

    const matching = reviews.filter(x => String(x.Employee) === String(name));
    const values = matching.map(x => Number(x.Rating)).filter(x => !isNaN(x));
    const average = values.length
      ? values.reduce((a,b) => a+b, 0) / values.length
      : 0;

    return {
      employee: name,
      average,
      count: values.length
    };

  }).sort((a,b) => b.average - a.average);

  employees.forEach(employee => {

    const stat = reviewStats.find(x => x.employee === employee.Name);

    employee.rating = stat ? stat.average : 0;
    employee.reviewCount = stat ? stat.count : 0;

  });

  const eom = readSheetObjects_("EmployeeOfMonth");
  const current = eom.length ? eom[eom.length - 1] : null;

  const history = eom.slice(-12).reverse();

  return {
    ok: true,
    maintenance: {
      enabled: boolSetting_("maintenanceEnabled", false),
      message: setting_("maintenanceMessage", "Bean Machine website is currently under maintenance.")
    },
    employeeOfMonth: current,
    employeeOfMonthHistory: history,
    employees,
    reviewStats,
    approvedReviews: reviews.slice(-20).reverse(),
    announcements: readSheetObjects_("Announcements")
      .filter(x => String(x.Active).toLowerCase() !== "false")
      .slice(-10)
      .reverse(),
    events: readSheetObjects_("Events")
      .filter(x => String(x.Active).toLowerCase() !== "false")
      .slice(-50)
      .reverse(),
    awards: readSheetObjects_("Awards")
      .filter(x => String(x.Active).toLowerCase() !== "false")
      .slice(-30)
      .reverse(),
    priorityOffers: readSheetObjects_("PriorityOffers")
      .filter(x => String(x.Active).toLowerCase() !== "false")
      .filter(x => { const until=String(x["Valid Until"]||"").trim(); return !until || new Date(until).getTime() >= new Date().setHours(0,0,0,0); })
      .slice(-30)
      .reverse(),
    menu: readSheetObjects_("Menu")
      .filter(x => String(x.Active).toLowerCase() !== "false"),
    gallery: readSheetObjects_("Gallery")
      .filter(x => String(x.Active).toLowerCase() !== "false"),
    priorityCustomers: readSheetObjects_("PriorityCustomers")
      .filter(x => String(x.Status || "Active").toLowerCase() === "active")
      .filter(x => {
        const until = String(x["Valid Until"] || "").trim();
        return !until || new Date(until).getTime() >= new Date().setHours(0,0,0,0);
      })
      .sort((a,b) => (String(b.Featured).toLowerCase() === "true" ? 1 : 0) - (String(a.Featured).toLowerCase() === "true" ? 1 : 0))
      .map(x => { const copy={...x}; delete copy["Ticket ID"]; return copy; })
      .slice(0, 50)
  };

}

function adminData_(pin) {

  if (!verifyAdmin_(pin)) {
    return json_({
      ok: false,
      error: "Invalid management PIN."
    });
  }

  return json_({
    ok: true,
    applications: readSheetObjects_("Applications").reverse(),
    reviews: readSheetObjects_("Reviews").reverse().map(row => {
      delete row["Moderation Token"];
      return row;
    }),
    employees: readSheetObjects_("Employees"),
    employeeOfMonth: readSheetObjects_("EmployeeOfMonth").reverse(),
    announcements: readSheetObjects_("Announcements").reverse(),
    events: readSheetObjects_("Events").reverse(),
    awards: readSheetObjects_("Awards").reverse(),
    priorityOffers: readSheetObjects_("PriorityOffers").reverse(),
    menu: readSheetObjects_("Menu"),
    gallery: readSheetObjects_("Gallery"),
    priorityCustomers: readSheetObjects_("PriorityCustomers").reverse(),
    settings: settingsObject_()
  });

}

function settingsObject_() {

  const result = {};

  readSheetObjects_("Settings").forEach(row => {
    result[row.Key] = row.Value;
  });

  return result;

}

function verifyAdmin_(pin) {

  const configured = props_().getProperty("ADMIN_PIN");

  if (!configured || !pin) return false;

  return String(pin) === String(configured);

}

function doPost(e) {

  try {

    const data = JSON.parse(e.postData.contents || "{}");

    switch (data.action || data.formType) {

      case "job_application":
        return handleApplication_(data);

      case "staff_review":
        return handleReview_(data);

      case "contact_message":
        return handleContact_(data);

      case "newsletter":
        return handleNewsletter_(data);

      case "update_application":
        requireAdmin_(data.pin);
        const applicationStatuses = ["Pending", "Interview", "Accepted", "Rejected"];
        if (applicationStatuses.indexOf(String(data.status)) === -1) {
          throw new Error("Invalid application status.");
        }
        updateRow_("Applications", data.row, {
          "Status": String(data.status)
        });
        notifyStatusChange_(data);
        return json_({ok:true});

      case "moderate_review":
        requireAdmin_(data.pin);
        const reviewStatuses = ["Approved", "Rejected", "Pending"];
        if (reviewStatuses.indexOf(String(data.status)) === -1) {
          throw new Error("Invalid review status.");
        }
        updateRow_("Reviews", data.row, {
          "Status": String(data.status)
        });
        return json_({ok:true});

      case "save_employee":
        requireAdmin_(data.pin);
        appendRow_("Employees", [
          clean_(data.name),
          clean_(data.rank),
          clean_(data.photo),
          clean_(data.bio),
          "true"
        ]);
        return json_({ok:true});

      case "delete_employee":
        requireAdmin_(data.pin);
        deleteRow_("Employees", data.row);
        return json_({ok:true});

      case "save_eom":
        requireAdmin_(data.pin);
        appendRow_("EmployeeOfMonth", [
          clean_(data.month),
          clean_(data.name),
          clean_(data.rank),
          clean_(data.photo),
          clean_(data.message),
          clean_(data.highlight),
          new Date()
        ]);
        notifySimple_("🏆 Employee of the Month Updated", data.name + " was selected as Employee of the Month for " + data.month + ".");
        return json_({ok:true});

      case "save_announcement":
        requireAdmin_(data.pin);
        appendRow_("Announcements", [
          clean_(data.date || new Date()),
          clean_(data.title),
          clean_(data.message),
          "true"
        ]);
        notifySimple_("📢 Bean Machine Announcement", data.title + "\n" + data.message);
        return json_({ok:true});

      case "save_event":
        requireAdmin_(data.pin);
        appendRow_("Events", [
          clean_(data.date),
          clean_(data.time),
          clean_(data.title),
          clean_(data.location),
          clean_(data.description),
          "true"
        ]);
        notifySimple_("📅 Bean Machine Event", data.title + "\n" + data.date + " " + data.time);
        return json_({ok:true});

      case "save_menu":
        requireAdmin_(data.pin);
        appendRow_("Menu", [
          clean_(data.name),
          clean_(data.price),
          clean_(data.image),
          clean_(data.description),
          "true"
        ]);
        return json_({ok:true});

      case "save_gallery":
        requireAdmin_(data.pin);
        appendRow_("Gallery", [
          clean_(data.title),
          clean_(data.image),
          "true"
        ]);
        return json_({ok:true});

      case "save_priority":
        requireAdmin_(data.pin);
        appendRow_("PriorityCustomers", [
          clean_(data.name), clean_(data.tier || "Priority"), clean_(data.photo),
          clean_(data.offer), clean_(data.benefits), clean_(data.ticketId),
          clean_(data.validUntil), clean_(data.status || "Active"),
          String(data.featured) === "true" ? "true" : "false", new Date()
        ]);
        notifySimple_("💎 Priority Customer Added", data.name + " • " + (data.tier || "Priority") + " • Ticket " + data.ticketId, "GENERAL");
        return json_({ok:true});

      case "delete_priority":
        requireAdmin_(data.pin);
        deleteRow_("PriorityCustomers", data.row);
        return json_({ok:true});

      case "save_priority_offer":
        requireAdmin_(data.pin);
        appendRow_("PriorityOffers", [clean_(data.title), clean_(data.description), clean_(data.tier || "All"), clean_(data.discount), clean_(data.validUntil), "true", new Date()]);
        notifySimple_("💎 Priority Offer Published", data.title + " • " + (data.tier || "All"), "GENERAL");
        return json_({ok:true});

      case "delete_priority_offer":
        requireAdmin_(data.pin);
        deleteRow_("PriorityOffers", data.row);
        return json_({ok:true});

      case "save_award":
        requireAdmin_(data.pin);
        appendRow_("Awards", [clean_(data.date || new Date()), clean_(data.name), clean_(data.rank), clean_(data.award), clean_(data.photo), clean_(data.description), "true", new Date()]);
        notifySimple_("🏅 Bean Machine Staff Award", data.name + " • " + data.award, "GENERAL");
        return json_({ok:true});

      case "delete_award":
        requireAdmin_(data.pin);
        deleteRow_("Awards", data.row);
        return json_({ok:true});

      case "save_settings":
        requireAdmin_(data.pin);
        saveSettings_(data);
        return json_({ok:true});

      default:
        return json_({ok:false, error:"Unknown action."});

    }

  } catch (error) {

    console.error(error);

    return json_({
      ok:false,
      error:String(error)
    });

  }

}

function handleApplication_(data) {

  const application = {
    name: clean_(data.name),
    phone: clean_(data.phone),
    cid: clean_(data.cid),
    discord: clean_(data.discord),
    family: clean_(data.family),
    flexibleHours: clean_(data.flexibleHours),
    followRules: clean_(data.followRules),
    source: clean_(data.source || "Bean Machine Website")
  };

  validateApplication_(application);

  appendRow_("Applications", [
    new Date(),
    application.name,
    application.phone,
    application.cid,
    application.discord,
    application.family,
    application.flexibleHours,
    application.followRules,
    application.source,
    "Pending"
  ]);

  let notification = {ok:true, skipped:true, reason:"Notifications disabled."};

  if (boolSetting_("notifyApplications", true)) {
    notification = notifyApplication_(application);
  }

  return json_({
    ok:true,
    saved:true,
    notificationOk: notification.ok !== false,
    notification: notification
  });

}

function handleReview_(data) {

  const rating = Number(data.rating);
  if (!data.employee || !data.reviewType || !data.message) {
    throw new Error("Employee, feedback type, and message are required.");
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const token = Utilities.getUuid().replace(/-/g, "");

  appendRow_("Reviews", [
    new Date(),
    clean_(data.employee),
    rating,
    clean_(data.reviewerName),
    clean_(data.reviewerDiscord),
    clean_(data.reviewType),
    clean_(data.message),
    "Pending",
    token
  ]);

  if (boolSetting_("notifyReviews", true)) {
    notifyReview_(data, token);
  }

  return json_({ok:true});

}

function moderateReviewLink_(rowNumber, status, token) {

  const row = Number(rowNumber);
  const requestedStatus = String(status || "");
  const allowed = ["Approved", "Rejected"];

  if (!row || allowed.indexOf(requestedStatus) === -1 || !token) return html_("Invalid moderation link.");

  const sh = sheet_().getSheetByName("Reviews");
  if (!sh || row < 2 || row > sh.getLastRow()) return html_("This review could not be found.");

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const statusCol = headers.indexOf("Status") + 1;
  const tokenCol = headers.indexOf("Moderation Token") + 1;
  const currentToken = tokenCol ? String(sh.getRange(row, tokenCol).getValue()) : "";

  if (!tokenCol || currentToken !== String(token)) return html_("This moderation link is invalid or has already been used.");

  const currentStatus = String(sh.getRange(row, statusCol).getValue() || "Pending");
  if (currentStatus !== "Pending") return html_("This review has already been moderated as " + currentStatus + ".");

  sh.getRange(row, statusCol).setValue(requestedStatus);
  sh.getRange(row, tokenCol).setValue("");

  const review = readSheetObjects_("Reviews").find(x => Number(x._row) === row);
  if (review) {
    notifyEmbed_(
      requestedStatus === "Approved" ? "✅ Bean Machine Review Approved" : "❌ Bean Machine Review Rejected",
      "A staff review was " + requestedStatus.toLowerCase() + " by management.",
      [
        ["Employee", review.Employee || "Not provided", true],
        ["Rating", (review.Rating || "-") + " / 5", true],
        ["Feedback Type", review["Feedback Type"] || "Not provided", true],
        ["Reviewer", review["Reviewer Name"] || "Not provided", true],
        ["Discord", review["Reviewer Discord"] || "Not provided", true],
        ["Review", review.Message || "Not provided", false],
        ["Moderation Status", requestedStatus, true],
        ["Review Row", String(row), true]
      ],
      12749046,
      "REVIEWS"
    );
  } else {
    notifySimple_("⭐ Review Moderated", "Review row " + row + " was marked " + requestedStatus + ".", "REVIEWS");
  }

  return html_("<h2>Review " + requestedStatus + "</h2><p>The Bean Machine review has been updated successfully.</p>");
}

function verifyPriority_(ticket) {
  const code = clean_(ticket).toLowerCase();
  if (!code) return json_({ok:false, valid:false, error:"Enter a Priority Ticket ID."});
  const rows = readSheetObjects_("PriorityCustomers");
  const found = rows.find(x => String(x["Ticket ID"] || "").trim().toLowerCase() === code);
  if (!found) return json_({ok:true, valid:false, message:"Ticket not found or inactive."});
  const status = String(found.Status || "Active").toLowerCase();
  const until = String(found["Valid Until"] || "").trim();
  const expired = until && new Date(until).getTime() < new Date().setHours(0,0,0,0);
  if (status !== "active" || expired) return json_({ok:true, valid:false, message:"This Priority Ticket is inactive or expired."});
  return json_({ok:true, valid:true, member:{name:found.Name, tier:found.Tier || "Priority", offer:found.Offer || "Active membership", validUntil:until || "No expiry"}});
}

function html_(message) {
  return HtmlService.createHtmlOutput("<!doctype html><html><head><meta name='viewport' content='width=device-width,initial-scale=1'><title>Bean Machine</title></head><body style='font-family:Arial,sans-serif;background:#111;color:#fff;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px'><main style='max-width:520px;background:#1d1d1d;padding:36px;border-radius:18px;border:1px solid #333'><div style='font-size:42px'>☕</div>" + message + "</main></body></html>");
}

function handleContact_(data) {

  const sh = sheet_();
  let target = sh.getSheetByName("Contact");

  if (!target) {
    target = sh.insertSheet("Contact");
    target.appendRow(["Timestamp","Name","Email","Subject","Message"]);
  }

  target.appendRow([
    new Date(),
    clean_(data.name),
    clean_(data.email),
    clean_(data.subject),
    clean_(data.message)
  ]);

  if (boolSetting_("notifyContact", true)) {
    notifySimple_("📩 Bean Machine Contact Message",
      "Name: " + data.name +
      "\nEmail: " + data.email +
      "\nSubject: " + data.subject +
      "\n\n" + data.message, "CONTACT");
  }

  return json_({ok:true});

}

function handleNewsletter_(data) {

  const sh = sheet_();
  let target = sh.getSheetByName("Newsletter");

  if (!target) {
    target = sh.insertSheet("Newsletter");
    target.appendRow(["Timestamp","Email"]);
  }

  target.appendRow([new Date(), clean_(data.email)]);

  if (boolSetting_("notifyNewsletter", true)) {
    notifySimple_("📬 New Bean Machine Newsletter Subscriber", clean_(data.email), "NEWSLETTER");
  }

  return json_({ok:true});

}

function requireAdmin_(pin) {

  if (!verifyAdmin_(pin)) {
    throw new Error("Invalid management PIN.");
  }

}

function appendRow_(sheetName, values) {

  const sh = sheet_().getSheetByName(sheetName);

  if (!sh) throw new Error("Missing sheet: " + sheetName);

  sh.appendRow(values);

}

function updateRow_(sheetName, rowNumber, changes) {

  const sh = sheet_().getSheetByName(sheetName);
  const row = Number(rowNumber);

  if (!sh || !row || row < 2 || row > sh.getLastRow()) throw new Error("Invalid row.");

  const headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];

  Object.keys(changes).forEach(key => {

    const column = headers.indexOf(key);

    if (column >= 0) {
      sh.getRange(row, column + 1).setValue(changes[key]);
    }

  });

}

function saveSettings_(data) {

  const sh = sheet_().getSheetByName("Settings");

  const values = {
    notifyApplications: data.notifyApplications,
    notifyReviews: data.notifyReviews,
    notifyContact: data.notifyContact,
    notifyNewsletter: data.notifyNewsletter,
    maintenanceEnabled: data.maintenanceEnabled,
    maintenanceMessage: clean_(data.maintenanceMessage)
  };

  Object.keys(values).forEach(key => {

    const rows = readSheetObjects_(sh);
    const existing = rows.find(x => x.Key === key);

    if (existing) {
      sh.getRange(existing._row, 2).setValue(String(values[key]));
    } else {
      sh.appendRow([key, String(values[key])]);
    }

  });

}

function notifyApplication_(data) {

  const fields = [
    ["Name (in city)", data.name, true],
    ["Phone", data.phone, true],
    ["CID", data.cid, true],
    ["Discord Username", data.discord, true],
    ["Family / Gang / Organization / Citizen", data.family, true],
    ["Flexible Hours", data.flexibleHours, true],
    ["Follow Company Rules", data.followRules, true]
  ];

  return notifyEmbed_(
    "☕ New Bean Machine Job Application",
    "A new application was submitted from the Bean Machine website.",
    fields,
    12749046,
    "APPLICATIONS"
  );

}

function notifyReview_(data, token) {

  const baseUrl = ScriptApp.getService().getUrl();
  const row = sheet_().getSheetByName("Reviews").getLastRow();
  const approveUrl = baseUrl + "?action=moderate_review_link&row=" + encodeURIComponent(row) + "&status=Approved&token=" + encodeURIComponent(token);
  const rejectUrl = baseUrl + "?action=moderate_review_link&row=" + encodeURIComponent(row) + "&status=Rejected&token=" + encodeURIComponent(token);

  return notifyEmbed_("⭐ New Bean Machine Staff Feedback",
    "A new review is waiting for management approval.\n\n**[✅ APPROVE REVIEW](" + approveUrl + ")**\n**[❌ REJECT REVIEW](" + rejectUrl + ")**",
    [
      ["Employee", data.employee, true],
      ["Rating", data.rating + " / 5", true],
      ["Type", data.reviewType, true],
      ["Reviewer", data.reviewerName || "Not provided", true],
      ["Discord", data.reviewerDiscord || "Not provided", true],
      ["Message", data.message, false]
    ],
    12749046,
    String(data.reviewType || "").toLowerCase().includes("complaint") ? "COMPLAINTS" : "REVIEWS");
}

function notifyStatusChange_(data) {
  const row = Number(data.row);
  const status = String(data.status || "");
  const applications = readSheetObjects_("Applications");
  const application = applications.find(x => Number(x._row) === row);

  if (!application) {
    return notifySimple_(
      "📋 Bean Machine Application Status Updated",
      "Application row: " + row + "\nNew status: " + status,
      "APPLICATION_STATUS"
    );
  }

  const statusInfo = {
    Pending: { icon: "🕐", title: "Application Set to Pending", message: "This application is waiting for management review." },
    Interview: { icon: "🎙️", title: "Application Moved to Interview", message: "The applicant has been selected for an interview." },
    Accepted: { icon: "✅", title: "Application Accepted", message: "The applicant has been accepted by Bean Machine." },
    Rejected: { icon: "❌", title: "Application Rejected", message: "The applicant has been rejected by Bean Machine." }
  };
  const info = statusInfo[status] || { icon: "📋", title: "Application Status Updated", message: "The application status was changed." };

  return notifyEmbed_(
    info.icon + " Bean Machine — " + info.title,
    info.message + "\n\n**Application Status: " + status + "**",
    [
      ["Applicant", application["Name (in city)"] || "Not provided", true],
      ["Phone", application.Phone || "Not provided", true],
      ["CID", application.CID || "Not provided", true],
      ["Discord Username", application["Discord Username"] || "Not provided", true],
      ["Family / Gang / Organization / Citizen", application["Family Name"] || "Not provided", true],
      ["Flexible Hours", application["Flexible Hours"] || "Not provided", true],
      ["Follow Company Rules", application["Follow Company Rules"] || "Not provided", true],
      ["Application Status", status, true],
      ["Application Row", String(row), true]
    ],
    12749046,
    "APPLICATION_STATUS"
  );
}

function webhookProperty_(type) {
  const map = {
    APPLICATIONS: "DISCORD_WEBHOOK_APPLICATIONS",
    REVIEWS: "DISCORD_WEBHOOK_REVIEWS",
    COMPLAINTS: "DISCORD_WEBHOOK_COMPLAINTS",
    APPLICATION_STATUS: "DISCORD_WEBHOOK_APPLICATION_STATUS",
    CONTACT: "DISCORD_WEBHOOK_CONTACT",
    NEWSLETTER: "DISCORD_WEBHOOK_NEWSLETTER",
    GENERAL: "DISCORD_WEBHOOK_GENERAL"
  };

  const dedicated = map[type] ? String(props_().getProperty(map[type]) || "").trim() : "";
  const fallback = String(props_().getProperty("DISCORD_WEBHOOK_URL") || "").trim();
  return dedicated || fallback;
}

function notifySimple_(title, message, type) {
  const webhook = webhookProperty_(type || "GENERAL");
  if (!webhook) {
    return {ok:false, error:"No Discord webhook is configured for " + (type || "GENERAL") + "."};
  }

  try {
    const response = UrlFetchApp.fetch(webhook, {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({
        username:"Bean Machine Website",
        embeds:[{
          title:truncate_(title, 256),
          description:truncate_(message, 3800),
          color:12749046,
          footer:{text:"Bean Machine • Developed by Azzy Adi"}
        }],
        allowed_mentions:{parse:[]}
      }),
      muteHttpExceptions:true
    });

    return webhookResult_(response, type);
  } catch (error) {
    console.error("Discord webhook error: " + error);
    return {ok:false, error:"Discord webhook request failed."};
  }
}

function notifyEmbed_(title, description, fields, color, type) {
  const webhook = webhookProperty_(type || "GENERAL");
  if (!webhook) {
    return {ok:false, error:"No Discord webhook is configured for " + (type || "GENERAL") + "."};
  }

  const embedFields = fields.map(item => ({
    name: truncate_(item[0], 256),
    value: truncate_(String(item[1] || "Not provided").replace(/@/g, "@\u200b"), 1024),
    inline: item[2]
  }));

  try {
    const response = UrlFetchApp.fetch(webhook, {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({
        username:"Bean Machine Website",
        embeds:[{
          title:truncate_(title, 256),
          description:truncate_(description, 3800),
          color:color || 12749046,
          fields:embedFields,
          timestamp:new Date().toISOString(),
          footer:{text:"Bean Machine • Developed by Azzy Adi"}
        }],
        allowed_mentions:{parse:[]}
      }),
      muteHttpExceptions:true
    });

    return webhookResult_(response, type);
  } catch (error) {
    console.error("Discord webhook error: " + error);
    return {ok:false, error:"Discord webhook request failed."};
  }
}

function webhookResult_(response, type) {
  const code = response.getResponseCode();
  if (code >= 200 && code < 300) {
    return {ok:true, status:code, type:type || "GENERAL"};
  }

  const body = String(response.getContentText() || "").replace(/https?:\/\/[^\s]+/gi, "[redacted-url]");
  console.error("Discord webhook " + (type || "GENERAL") + " returned HTTP " + code + ": " + body);
  return {
    ok:false,
    status:code,
    type:type || "GENERAL",
    error:"Discord rejected the webhook request (HTTP " + code + ")."
  };
}

function validateApplication_(data) {
  const required = ["name", "phone", "cid", "discord", "family", "flexibleHours", "followRules"];
  required.forEach(key => {
    if (!data[key]) throw new Error("Missing required application field: " + key + ".");
  });

  if (["Yes", "No"].indexOf(data.flexibleHours) === -1) {
    throw new Error("Invalid flexible hours selection.");
  }
  if (["Yes", "No"].indexOf(data.followRules) === -1) {
    throw new Error("Invalid company rules selection.");
  }
}

function clean_(value) {
  return String(value == null ? "" : value).trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function truncate_(value, maxLength) {
  const text = clean_(value);
  const max = Math.max(1, Number(maxLength) || 200);
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function deleteRow_(sheetName, rowNumber) {
  const sh = sheet_().getSheetByName(sheetName);
  const row = Number(rowNumber);
  if (!sh || !row || row < 2 || row > sh.getLastRow()) throw new Error("Invalid row.");
  sh.deleteRow(row);
}

function json_(object) {

  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);

}
