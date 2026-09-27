
/*
 * BEAN MACHINE - GOOGLE APPS SCRIPT BACKEND
 *
 * GitHub Pages -> this Web App -> Google Sheets -> Discord Webhook
 *
 * Script Properties required:
 *   SPREADSHEET_ID
 *   DISCORD_WEBHOOK_URL
 *   ADMIN_PIN
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
      return adminData_(e.parameter.pin || "");
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
      .slice(-20)
      .reverse(),
    menu: readSheetObjects_("Menu")
      .filter(x => String(x.Active).toLowerCase() !== "false"),
    gallery: readSheetObjects_("Gallery")
      .filter(x => String(x.Active).toLowerCase() !== "false")
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
    menu: readSheetObjects_("Menu"),
    gallery: readSheetObjects_("Gallery"),
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
        updateRow_("Applications", data.row, {
          "Status": data.status
        });
        notifyStatusChange_(data);
        return json_({ok:true});

      case "moderate_review":
        requireAdmin_(data.pin);
        updateRow_("Reviews", data.row, {
          "Status": data.status
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

  appendRow_("Applications", [
    new Date(),
    clean_(data.name),
    clean_(data.phone),
    clean_(data.cid),
    clean_(data.discord),
    clean_(data.family),
    clean_(data.flexibleHours),
    clean_(data.followRules),
    clean_(data.source || "Bean Machine Website"),
    "Pending"
  ]);

  if (boolSetting_("notifyApplications", true)) {
    notifyApplication_(data);
  }

  return json_({ok:true});

}

function handleReview_(data) {

  const token = Utilities.getUuid().replace(/-/g, "");

  appendRow_("Reviews", [
    new Date(),
    clean_(data.employee),
    Number(data.rating) || 0,
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
  notifySimple_("⭐ Review Moderated", "Review row " + row + " was marked " + requestedStatus + ".", "REVIEWS");

  return html_("<h2>Review " + requestedStatus + "</h2><p>The Bean Machine review has been updated successfully.</p>");
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

  if (!sh || !row || row < 2) throw new Error("Invalid row.");

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

  notifyEmbed_("☕ New Bean Machine Job Application",
    "A new application was submitted from the Bean Machine website.",
    fields,
    12749046,
    "APPLICATIONS");

}

function notifyReview_(data, token) {

  const baseUrl = ScriptApp.getService().getUrl();
  const row = sheet_().getSheetByName("Reviews").getLastRow();
  const approveUrl = baseUrl + "?action=moderate_review_link&row=" + encodeURIComponent(row) + "&status=Approved&token=" + encodeURIComponent(token);
  const rejectUrl = baseUrl + "?action=moderate_review_link&row=" + encodeURIComponent(row) + "&status=Rejected&token=" + encodeURIComponent(token);

  notifyEmbed_("⭐ New Bean Machine Staff Feedback",
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

  notifySimple_(
    "📋 Bean Machine Application Status Updated",
    "Application row: " + data.row + "\nNew status: " + data.status,
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
  const dedicated = map[type] ? props_().getProperty(map[type]) : "";
  return dedicated || props_().getProperty("DISCORD_WEBHOOK_URL") || "";
}

function notifySimple_(title, message, type) {
  const webhook = webhookProperty_(type || "GENERAL");
  if (!webhook) return;
  try {
    UrlFetchApp.fetch(webhook, {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({
        username:"Bean Machine Website",
        embeds:[{
          title:title,
          description:truncate_(message, 3800),
          color:12749046,
          footer:{text:"Bean Machine • Developed by Azzy Adi"}
        }],
        allowed_mentions:{parse:[]}
      }),
      muteHttpExceptions:true
    });
  } catch (error) {
    console.error("Discord webhook error:", error);
  }
}

function notifyEmbed_(title, description, fields, color, type) {
  const webhook = webhookProperty_(type || "GENERAL");
  if (!webhook) return;
  const embedFields = fields.map(item => ({
    name: truncate_(item[0], 256),
    value: truncate_(String(item[1] || "Not provided").replace(/@/g, "@\u200b"), 1024),
    inline: item[2]
  }));
  try {
    UrlFetchApp.fetch(webhook, {
      method:"post",
      contentType:"application/json",
      payload:JSON.stringify({
        username:"Bean Machine Website",
        embeds:[{title, description, color:color || 12749046, fields:embedFields, timestamp:new Date().toISOString(), footer:{text:"Bean Machine • Developed by Azzy Adi"}}],
        allowed_mentions:{parse:[]}
      }),
      muteHttpExceptions:true
    });
  } catch (error) {
    console.error("Discord webhook error:", error);
  }
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
