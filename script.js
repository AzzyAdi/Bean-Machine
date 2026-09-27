/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

"use strict";

/*====================================
    DOM READY
====================================*/

document.addEventListener("DOMContentLoaded", () => {

    initLoader();
    initStickyNavbar();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initHeroParallax();
    initRevealAnimation();
    initGalleryHover();
    initApplicationForm();
    initSuccessPopup();
    initBeanMachineLiveSystem();
    initReviewForm();
    initManagementDashboard();

});

/*====================================
    LOADER
====================================*/

function initLoader() {

    const loader = document.getElementById("loader");

    if (!loader) return;

    window.addEventListener("load", () => {

        loader.style.transition = "opacity .5s ease";

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 500);

    });

}

/*====================================
    STICKY NAVBAR
====================================*/

function initStickyNavbar() {

    const header = document.querySelector("header");

    if (!header) return;

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {

            header.style.background = "#000";
            header.style.boxShadow = "0 10px 30px rgba(0,0,0,.45)";

        } else {

            header.style.background = "rgba(0,0,0,.45)";
            header.style.boxShadow = "none";

        }

    });

}

/*====================================
    MOBILE MENU
====================================*/

function initMobileMenu() {

    const button = document.querySelector(".mobile-menu");

    const menu = document.getElementById("mobileMenu");

    if (!button || !menu) return;

    button.addEventListener("click", () => {

        menu.classList.toggle("active");

    });

    menu.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            menu.classList.remove("active");

        });

    });

}

/*====================================
    SMOOTH SCROLL
====================================*/

function initSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

}

/*====================================
    BACK TO TOP
====================================*/

function initBackToTop() {

    const btn = document.getElementById("topBtn");

    if (!btn) return;

    // Hide the button when the page first loads
    btn.style.display = "none";

    window.addEventListener("scroll", () => {

        btn.style.display = window.scrollY > 500
            ? "flex"
            : "none";

    });

    btn.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}
/*=====================================================
DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    HERO PARALLAX
====================================*/

function initHeroParallax() {

    const hero = document.querySelector(".hero-content");

    if (!hero) return;

  document.addEventListener("mousemove", (e) => {

    cursor.style.left = (e.clientX - 9) + "px";
    cursor.style.top = (e.clientY - 9) + "px";

});

}

/*====================================
    SCROLL REVEAL
====================================*/

function initRevealAnimation() {

    const elements = document.querySelectorAll(
        "section,.food-card,.menu-card,.staff-card,.feature"
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

            }

        });

    }, {

        threshold: 0.15

    });

    elements.forEach(el => {

        el.classList.add("fade-up");

        observer.observe(el);

    });

}

/*====================================
    GALLERY HOVER
====================================*/

function initGalleryHover() {

    const images = document.querySelectorAll(".gallery-grid img");

    images.forEach(img => {

        img.setAttribute("draggable", "false");

        img.addEventListener("mouseenter", () => {

            img.style.transform = "scale(1.05)";

        });

        img.addEventListener("mouseleave", () => {

            img.style.transform = "scale(1)";

        });

    });

}

/*====================================
    GALLERY LIGHTBOX
====================================*/

(function () {

    const images = document.querySelectorAll(".gallery-grid img");

    if (!images.length) return;

    const lightbox = document.createElement("div");

    lightbox.id = "lightbox";

    lightbox.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.92);
        display:none;
        justify-content:center;
        align-items:center;
        z-index:999999;
        cursor:pointer;
        padding:40px;
    `;

    document.body.appendChild(lightbox);

    images.forEach(img => {

        img.addEventListener("click", () => {

            lightbox.innerHTML = "";

            const image = document.createElement("img");

            image.src = img.src;

            image.style.maxWidth = "90%";
            image.style.maxHeight = "90%";
            image.style.borderRadius = "20px";

            lightbox.appendChild(image);

            lightbox.style.display = "flex";

        });

    });

    lightbox.addEventListener("click", () => {

        lightbox.style.display = "none";

    });

})();
/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    CONTACT FORM
====================================*/

function initContactForm() {

    const form = document.querySelector(".contact-form form");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fields = form.querySelectorAll("input, textarea");

        const data = {
            action: "contact_message",
            name: fields[0]?.value.trim() || "",
            email: fields[1]?.value.trim() || "",
            subject: fields[2]?.value.trim() || "",
            message: fields[3]?.value.trim() || "",
            submittedAt: new Date().toISOString()
        };

        try {

            await bmPost(data);

            alert("Thank you! Your message has been sent.");
            form.reset();

        } catch (error) {

            alert("We could not send your message. Please try again.");

        }

    });

}
/*====================================
    NEWSLETTER
====================================*/

function initNewsletter() {

    const button = document.querySelector(".newsletter-form button");
    const input = document.querySelector(".newsletter-form input");

    if (!button || !input) return;

    button.addEventListener("click", async function (e) {

        e.preventDefault();

        const email = input.value.trim();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            alert("Please enter a valid email address.");
            input.focus();
            return;

        }

        button.disabled = true;

        try {

            await bmPost({
                action: "newsletter",
                email,
                submittedAt: new Date().toISOString()
            });

            alert("Thank you for subscribing!");
            input.value = "";

        } catch (error) {

            alert("We could not complete your subscription. Please try again.");

        } finally {

            button.disabled = false;

        }

    });

}
/*====================================
    Apply BUTTON
====================================*/

document.querySelectorAll(".discord").forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        // Replace with your own Discord invite
        window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSd1jRHayR9owBeE5TgUXO2guuTnrQQ8Nf1EJpiJHaHz1ZSUCA/viewform?usp=publish-editor";

    });

});

/*====================================
    JOIN BUTTON
====================================*/

document.querySelectorAll(".join").forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        alert("Replace this button with your FiveM server connect link.");

    });

});

/*====================================
    RIPPLE EFFECT
====================================*/

document.querySelectorAll("button,.btn,.btn2,.join,.discord").forEach(button => {

    button.addEventListener("click", function (e) {

        const ripple = document.createElement("span");

        const size = Math.max(this.clientWidth, this.clientHeight);

        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.position = "absolute";
        ripple.style.borderRadius = "50%";
        ripple.style.pointerEvents = "none";
        ripple.style.background = "rgba(255,255,255,.35)";
        ripple.style.transform = "scale(0)";
        ripple.style.animation = "ripple .6s linear";

        const rect = this.getBoundingClientRect();

        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";

        this.style.position = "relative";
        this.style.overflow = "hidden";

        this.appendChild(ripple);

        setTimeout(() => {

            ripple.remove();

        }, 600);

    });

});

/*====================================
    CONSOLE MESSAGE
====================================*/

console.log("==================================");
console.log(" Bean Machine Website Loaded");
console.log(" Script Part 3 Loaded");
console.log("==================================");

/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    MENU CATEGORY ACTIVE
====================================*/

(function () {

    const buttons = document.querySelectorAll(".menu-category button");

    if (!buttons.length) return;

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            buttons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

        });

    });

})();

/*====================================
    RANDOM HERO TEXT
====================================*/

(function () {

    const heroText = document.querySelector(".hero p");

    if (!heroText) return;

    const quotes = [

        "Serving Los Santos with premium coffee.",
        "Welcome to Bean Machine.",
        "Best Coffee Shop in the City.",
        "Join our amazing restaurant team."

    ];

    let index = 0;

    setInterval(() => {

        index++;

        if (index >= quotes.length) {

            index = 0;

        }

        heroText.style.opacity = "0";

        setTimeout(() => {

            heroText.textContent = quotes[index];

            heroText.style.opacity = "1";

        }, 300);

    }, 5000);

})();

/*====================================
    MENU CARD HIGHLIGHT
====================================*/

(function () {

    const cards = document.querySelectorAll(".menu-card");

    if (!cards.length) return;

    let current = 0;

    setInterval(() => {

        cards.forEach(card => {

            card.classList.remove("menu-highlight");

        });

        cards[current].classList.add("menu-highlight");

        current++;

        if (current >= cards.length) {

            current = 0;

        }

    }, 2500);

})();

/*====================================
    IMAGE PRELOAD
====================================*/

(function () {

    const images = document.querySelectorAll("img");

    images.forEach(img => {

        const preload = new Image();

        preload.src = img.src;

    });

})();

/*====================================
    REMOVE IMAGE DRAGGING
====================================*/

document.querySelectorAll("img").forEach(img => {

    img.draggable = false;

});

/*====================================
    HOVER EFFECT FOR NAV LINKS
====================================*/

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("mouseenter", () => {

        link.style.color = "#c28b36";

    });

    link.addEventListener("mouseleave", () => {

        link.style.color = "";

    });

});

/*====================================
    BUTTON HOVER SCALE
====================================*/

document.querySelectorAll(".btn,.btn2,.join,.discord,button").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "scale(1.05)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "";

    });

});

console.log("Script Part 4 Loaded");

/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    SCROLL PROGRESS BAR
====================================*/

(function () {

    let progress = document.getElementById("progressBar");

    if (!progress) {

        progress = document.createElement("div");

        progress.id = "progressBar";

        document.body.appendChild(progress);

    }

    window.addEventListener("scroll", () => {

        const total =
            document.documentElement.scrollHeight - window.innerHeight;

        const percent = (window.scrollY / total) * 100;

        progress.style.width = percent + "%";

    });

})();

/*====================================
    CURSOR GLOW
====================================*/

(function () {

    const cursor = document.createElement("div");

    cursor.id = "cursorGlow";

    document.body.appendChild(cursor);

    document.addEventListener("mousemove", e => {

        cursor.style.left = e.clientX + "px";

        cursor.style.top = e.clientY + "px";

    });

})();

/*====================================
    FLOATING PARTICLES
====================================*/

(function () {

    const container = document.createElement("div");

    container.id = "particles";

    document.body.appendChild(container);

    for (let i = 0; i < 20; i++) {

        const particle = document.createElement("span");

        particle.className = "particle";

        particle.style.left = Math.random() * 100 + "%";

        particle.style.animationDelay = Math.random() * 8 + "s";

        particle.style.animationDuration =
            5 + Math.random() * 6 + "s";

        container.appendChild(particle);

    }

})();

/*====================================
    CARD HOVER EFFECT
====================================*/

document.querySelectorAll(
".food-card,.menu-card,.staff-card"
).forEach(card => {

    card.addEventListener("mousemove", e => {

        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;

        const y = e.clientY - rect.top;

        const rotateY = (x - rect.width / 2) / 18;

        const rotateX = -(y - rect.height / 2) / 18;

        card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             scale(1.03)`;

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});

/*====================================
    LIVE CLOCK
====================================*/

(function () {

    const clock = document.getElementById("liveClock");

    if (!clock) return;

    function updateClock() {

        clock.textContent =
            new Date().toLocaleTimeString();

    }

    updateClock();

    setInterval(updateClock, 1000);

})();

console.log("Script Part 5 Loaded");

/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    DISABLE IMAGE DRAG
====================================*/

document.querySelectorAll("img").forEach(img=>{

    img.draggable=false;

});

/*====================================
    KEYBOARD SHORTCUTS
====================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="Home"){

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    }

});

/*====================================
    FADE NAVBAR LINKS
====================================*/

document.querySelectorAll(".nav-links a").forEach(link=>{

    link.addEventListener("mouseenter",()=>{

        link.style.color="#c28b36";

    });

    link.addEventListener("mouseleave",()=>{

        link.style.color="";

    });

});

/*====================================
    RANDOM FEATURED MENU
====================================*/

(function(){

const cards=document.querySelectorAll(".menu-card");

if(!cards.length) return;

function randomCard(){

cards.forEach(card=>{

card.classList.remove("featured-item");

});

const random=Math.floor(Math.random()*cards.length);

cards[random].classList.add("featured-item");

}

randomCard();

setInterval(randomCard,5000);

})();

/*====================================
    BUTTON CLICK ANIMATION
====================================*/

document.querySelectorAll(".btn,.btn2,.join,.discord,button").forEach(btn=>{

btn.addEventListener("mousedown",()=>{

btn.style.transform="scale(.95)";

});

btn.addEventListener("mouseup",()=>{

btn.style.transform="";

});

btn.addEventListener("mouseleave",()=>{

btn.style.transform="";

});

});

/*====================================
    PAGE READY
====================================*/

window.addEventListener("load",()=>{

document.body.classList.add("loaded");

console.log("Page Loaded Successfully");

});

/*=====================================================
 DEVELOPED BY AZZY ADI
======================================================*/

/*====================================
    WEBSITE VERSION
====================================*/

const WEBSITE={

name:"Bean Machine",

version:"1.0",

author:"Azad"

};

console.log(

"%c"+WEBSITE.name+

" v"+WEBSITE.version,

"color:#c28b36;font-size:20px;font-weight:bold"

);

/*====================================
    PERFORMANCE
====================================*/

window.addEventListener("pageshow",()=>{

console.log("Performance Ready");

});

/*====================================
    REMOVE LOADER SAFETY
====================================*/

setTimeout(()=>{

const loader=document.getElementById("loader");

if(loader){

loader.style.display="none";

}

},3000);

/*====================================
    SAFE IMAGE LOADING
====================================*/

document.querySelectorAll("img").forEach(img=>{

img.onerror=function(){

this.style.opacity=".25";

this.alt="Image Missing";

};

});

/*====================================
    OPTIONAL BUTTON PLACEHOLDERS
====================================*/

// Keep real links from index.html intact. Do not overwrite them with
// placeholder URLs after the page has loaded.

/*====================================
    END
====================================*/

console.log("====================================");

console.log(" Bean Machine Finished ");

console.log(" No Critical JavaScript Errors ");

console.log(" Website Ready ");

console.log("====================================");

function initSuccessPopup() {
    const popup = document.getElementById("popup");
    const close = document.getElementById("closePopup");
    if (!popup || !close) return;
    close.addEventListener("click", () => popup.classList.remove("active"));
    popup.addEventListener("click", (event) => {
        if (event.target === popup) popup.classList.remove("active");
    });
}

/*====================================
    DIRECT JOB APPLICATION
====================================*/

function initApplicationForm() {

    const form = document.getElementById("jobApplicationForm");
    const status = document.getElementById("applicationStatus");

    if (!form) return;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        const endpoint =
            (window.BEAN_MACHINE_CONFIG &&
             window.BEAN_MACHINE_CONFIG.GOOGLE_APPS_SCRIPT_URL) || "";

        if (!endpoint ||
            endpoint.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {

            if (status) {
                status.className = "application-status error";
                status.textContent =
                    "The application system is not configured yet. Please contact Bean Machine management.";
            }

            return;
        }

        const submitButton = form.querySelector(".application-submit");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        if (status) {
            status.className = "application-status";
            status.textContent = "Submitting your application...";
        }

        const data = Object.fromEntries(new FormData(form).entries());

        data.formType = "job_application";
        data.source = "Bean Machine Website";
        data.submittedAt = new Date().toISOString();

        try {

            // Use a GET request for public applications. Google Apps Script
            // web apps do not expose normal CORS headers, and browser no-cors
            // POSTs make failures impossible to detect. GET lets us read the
            // JSON response and confirm that the application was actually saved.
            const query = new URLSearchParams({
                action: "job_application",
                ...data
            });

            const response = await fetch(endpoint + "?" + query.toString(), {
                method: "GET",
                cache: "no-store"
            });

            if (!response.ok) throw new Error("Application server request failed.");

            const result = await response.json();
            if (!result.ok) throw new Error(result.error || "Application was not saved.");

            form.reset();

            if (status) {
                if (result.notificationOk === false) {
                    status.className = "application-status success";
                    status.textContent =
                        "Application submitted successfully, but the management Discord notification could not be delivered. Management can check the webhook settings.";
                } else {
                    status.className = "application-status success";
                    status.textContent =
                        "Application submitted successfully. Thank you for applying to Bean Machine!";
                }
            }

            const popup = document.getElementById("popup");
            if (popup) popup.classList.add("active");

        } catch (error) {

            console.error("Application submission error:", error);

            if (status) {
                status.className = "application-status error";
                status.textContent =
                    "We could not submit your application. Please try again or contact management.";
            }

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML =
                    '<i class="fas fa-paper-plane"></i> Submit Application';
            }

        }

    });

}


/*====================================
    BEAN MACHINE LIVE SYSTEM
====================================*/

function bmConfig() {
    return window.BEAN_MACHINE_CONFIG || {};
}

async function bmGet(action, params = {}) {

    const endpoint = bmConfig().GOOGLE_APPS_SCRIPT_URL || "";

    if (!endpoint || endpoint.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        throw new Error("Google Apps Script URL is not configured.");
    }

    // Always keep the endpoint action as the authoritative `action` query
    // parameter. Management mutations carry their specific operation in
    // `mutationAction` so it cannot overwrite `action=admin_mutation`.
    const queryParams = { ...params };
    delete queryParams.action;
    queryParams.action = action;
    const query = new URLSearchParams(queryParams);

    const response = await fetch(endpoint + "?" + query.toString(), {
        method: "GET",
        cache: "no-store"
    });

    if (!response.ok) throw new Error("Server request failed.");

    return await response.json();
}

async function bmPost(payload) {

    const endpoint = bmConfig().GOOGLE_APPS_SCRIPT_URL || "";

    if (!endpoint || endpoint.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE")) {
        throw new Error("Google Apps Script URL is not configured.");
    }

    await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    });

    // Google Apps Script receives the request. no-cors means the browser
    // intentionally cannot inspect the response.
    return { ok: true };
}

async function bmAdminPost(payload) {

    const mutationAction = payload && payload.action ? payload.action : "";
    const mutationPayload = { ...payload, mutationAction };
    delete mutationPayload.action;

    const data = await bmGet("admin_mutation", mutationPayload);

    if (!data || data.ok !== true) {
        throw new Error((data && data.error) || "Management action failed.");
    }

    return data;
}

async function refreshManagementTab(tab, panel) {
    const pin = sessionStorage.getItem("beanMachineAdminPin") || "";
    const fresh = await bmGet("admin", { pin });
    if (!fresh.ok) throw new Error(fresh.error || "Could not refresh management data.");
    window.BEAN_MACHINE_ADMIN_DATA = fresh;
    renderDashboardTab(tab, fresh, panel);
    return fresh;
}

async function refreshPublicLiveData() {
    try {
        const data = await bmGet("public", { _t: Date.now() });
        window.BEAN_MACHINE_PUBLIC_DATA = data;
        renderEmployeeOfMonth(data.employeeOfMonth, data.employeeOfMonthHistory);
        renderEmployees(data.employees || []);
        renderReviewLeaderboard(data.reviewStats || []);
        renderApprovedReviews(data.approvedReviews || []);
        populateReviewEmployees(data.employees || []);
        renderAnnouncements(data.announcements || []);
        renderEvents(data.events || []);
        renderManagedMenu(data.menu || []);
        renderManagedGallery(data.gallery || []);
        return data;
    } catch (error) {
        console.warn("Bean Machine live refresh:", error);
        return null;
    }
}

function bmEscape(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function bmStars(value) {

    const n = Math.max(0, Math.min(5, Number(value) || 0));

    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

}

async function initBeanMachineLiveSystem() {

    try {

        const data = await bmGet("public");

        window.BEAN_MACHINE_PUBLIC_DATA = data;

        if (data.maintenance && data.maintenance.enabled === true) {
            showMaintenanceMode(data.maintenance.message);
        }

        renderEmployeeOfMonth(data.employeeOfMonth, data.employeeOfMonthHistory);
        renderEmployees(data.employees || []);
        renderReviewLeaderboard(data.reviewStats || []);
        renderApprovedReviews(data.approvedReviews || []);
        populateReviewEmployees(data.employees || []);
        renderAnnouncements(data.announcements || []);
        renderEvents(data.events || []);
        renderManagedMenu(data.menu || []);
        renderManagedGallery(data.gallery || []);

    } catch (error) {

        console.warn("Bean Machine live system:", error);

    }

}

// Keep an already-open public page synchronized with management changes.
setInterval(() => {
    if (document.visibilityState === "visible") refreshPublicLiveData();
}, 30000);

function showMaintenanceMode(message) {

    const notice = document.createElement("div");

    notice.className = "maintenance-notice";

    notice.innerHTML =
        '<i class="fas fa-triangle-exclamation"></i>' +
        '<strong>Bean Machine Website Notice</strong>' +
        '<span>' + bmEscape(message || "The website is currently under maintenance.") + '</span>';

    document.body.prepend(notice);

}

function renderEmployeeOfMonth(current, history) {

    const name = document.getElementById("eomName");
    const rank = document.getElementById("eomRank");
    const message = document.getElementById("eomMessage");
    const highlight = document.getElementById("eomHighlight");
    const photo = document.getElementById("eomPhoto");
    const month = document.getElementById("eomMonth");
    const historyBox = document.getElementById("eomHistory");

    if (!name) return;

    if (!current) {

        name.textContent = "Employee of the Month will be announced soon.";
        rank.textContent = "";
        message.textContent = "";
        highlight.textContent = "";
        return;

    }

    name.textContent = current.name || "Bean Machine Employee";
    rank.textContent = current.rank || "";
    message.textContent = current.message || "";
    highlight.textContent = current.highlight || "";
    month.textContent = current.month || "";

    if (current.photo && photo) {
        photo.src = bmImageUrl(current.photo);
        photo.onerror = () => { photo.src = "https://via.placeholder.com/500x500?text=Bean+Machine"; };
    }

    if (historyBox) {

        historyBox.innerHTML = (history || []).map(item => `
            <div class="history-card">
                <small>${bmEscape(item.month)}</small>
                <h4>${bmEscape(item.name)}</h4>
                <p>${bmEscape(item.rank)}</p>
            </div>
        `).join("");

    }

}

function bmField(obj, ...keys) {
    for (const key of keys) {
        if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    }
    return "";
}

function bmImageUrl(value) {
    let url = String(value || "").trim();
    if (!url) return "https://via.placeholder.com/600x600?text=Bean+Machine";
    const drive = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/);
    if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w1000`;
    return url;
}

function renderEmployees(employees) {

    const box = document.getElementById("employeeProfiles");

    if (!box) return;

    if (!employees.length) {
        box.innerHTML = '<div class="live-empty">Employee profiles will appear here.</div>';
        return;
    }

    box.innerHTML = employees.map(employee => {

        const rating = bmField(employee, "rating", "Rating")
            ? Number(bmField(employee, "rating", "Rating")).toFixed(1)
            : "0.0";

        return `
            <article class="profile-card">
                <img src="${bmEscape(bmImageUrl(bmField(employee, "photo", "Photo")))}"
                     alt="${bmEscape(bmField(employee, "name", "Name"))}">
                <div class="profile-card-content">
                    <h3>${bmEscape(bmField(employee, "name", "Name"))}</h3>
                    <p class="profile-rank">${bmEscape(bmField(employee, "rank", "Rank"))}</p>
                    <p>${bmEscape(bmField(employee, "bio", "Bio"))}</p>
                    <p class="profile-rating">${bmStars(Math.round(Number(bmField(employee, "rating", "Rating") || 0)))} ${rating}/5</p>
                </div>
            </article>
        `;

    }).join("");

}

function populateReviewEmployees(employees) {

    const select = document.getElementById("reviewEmployee");

    if (!select) return;

    select.innerHTML =
        '<option value="" selected disabled>Select an employee</option>' +
        employees.map(employee =>
            `<option value="${bmEscape(bmField(employee, "name", "Name"))}">${bmEscape(bmField(employee, "name", "Name"))} — ${bmEscape(bmField(employee, "rank", "Rank"))}</option>`
        ).join("");

}

function renderReviewLeaderboard(stats) {

    const box = document.getElementById("ratingLeaderboard");

    if (!box) return;

    if (!stats.length) {
        box.innerHTML = '<div class="live-empty">No approved staff ratings yet.</div>';
        return;
    }

    box.innerHTML = stats.map((item, index) => `
        <div class="leaderboard-row">
            <div>
                <strong>${index + 1}. ${bmEscape(bmField(item, "employee", "Employee"))}</strong>
                <small>${Number(item.count || 0)} approved review(s)</small>
            </div>
            <div class="leaderboard-stars">
                ${bmStars(Math.round(Number(item.average || 0)))} ${Number(item.average || 0).toFixed(1)}
            </div>
        </div>
    `).join("");

}

function renderApprovedReviews(reviews) {

    const box = document.getElementById("approvedReviews");

    if (!box) return;

    if (!reviews.length) {
        box.innerHTML = '<div class="live-empty">No approved reviews yet.</div>';
        return;
    }

    box.innerHTML = reviews.map(item => `
        <article class="approved-review-card">
            <div class="approved-review-top">
                <strong>${bmEscape(bmField(item, "employee", "Employee"))}</strong>
                <span class="leaderboard-stars">${bmStars(Number(bmField(item, "rating", "Rating")))}</span>
            </div>
            <p>${bmEscape(bmField(item, "message", "Message"))}</p>
            <small>${bmEscape(item.reviewerName || "Bean Machine Guest")} • ${bmEscape(item.reviewType || "Service Review")}</small>
        </article>
    `).join("");

}

function renderAnnouncements(items) {

    const box = document.getElementById("announcementsList");

    if (!box) return;

    box.innerHTML = items.length ? items.map(item => `
        <article class="update-card">
            <span class="update-date">${bmEscape(item.date)}</span>
            <h4>${bmEscape(item.title)}</h4>
            <p>${bmEscape(bmField(item, "message", "Message"))}</p>
        </article>
    `).join("") : '<div class="live-empty">No announcements.</div>';

}

function renderEvents(items) {

    const box = document.getElementById("eventsList");

    if (!box) return;

    box.innerHTML = items.length ? items.map(item => `
        <article class="update-card">
            <span class="update-date">${bmEscape(item.date)}${item.time ? " • " + bmEscape(item.time) : ""}</span>
            <h4>${bmEscape(item.title)}</h4>
            <p>${bmEscape(item.location || "")}</p>
            <p>${bmEscape(item.description || "")}</p>
        </article>
    `).join("") : '<div class="live-empty">No upcoming events.</div>';

}

function renderManagedMenu(items) {
    const box = document.querySelector("#menu .menu-grid");
    if (!box) return;
    const managed = (items || []).filter(item => String(item.Active).toLowerCase() !== "false");
    box.querySelectorAll(".managed-menu-card").forEach(card => card.remove());
    if (!managed.length) return;
    const fragment = managed.map(item => `
        <div class="menu-card managed-menu-card">
            <img src="${bmEscape(bmImageUrl(item.image))}" alt="${bmEscape(item.name || "Bean Machine Menu Item")}">
            <h3>${bmEscape(item.name || "Menu Item")}</h3>
            <p>${bmEscape(item.description || "")}</p>
            <span>${bmEscape(item.price || "")}</span>
        </div>
    `).join("");
    box.insertAdjacentHTML("beforeend", fragment);
}

function renderManagedGallery(items) {
    const box = document.querySelector("#gallery .gallery-grid");
    if (!box) return;
    const managed = (items || []).filter(item => String(item.Active).toLowerCase() !== "false");
    box.querySelectorAll(".managed-gallery-image").forEach(image => image.parentElement.remove());
    if (!managed.length) return;
    const fragment = managed.map(item => `
        <div class="managed-gallery-image-wrap">
            <img class="managed-gallery-image" src="${bmEscape(bmImageUrl(item.image))}" alt="${bmEscape(item.title || "Bean Machine Gallery")}">
            ${item.title ? `<span class="managed-gallery-caption">${bmEscape(item.title)}</span>` : ""}
        </div>
    `).join("");
    box.insertAdjacentHTML("beforeend", fragment);
}


function initReviewForm() {

    const form = document.getElementById("staffReviewForm");
    const status = document.getElementById("reviewStatus");

    if (!form) return;

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const button = form.querySelector("button[type=submit]");

        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }

        const data = Object.fromEntries(new FormData(form).entries());

        data.formType = "staff_review";
        data.submittedAt = new Date().toISOString();

        try {

            await bmPost(data);

            form.reset();

            if (status) {
                status.className = "application-status success";
                status.textContent =
                    "Thank you. Your feedback was submitted for management review.";
            }

        } catch (error) {

            if (status) {
                status.className = "application-status error";
                status.textContent =
                    "We could not submit the feedback. Please try again.";
            }

        } finally {

            if (button) {
                button.disabled = false;
                button.innerHTML =
                    '<i class="fas fa-star"></i> Submit Staff Feedback';
            }

        }

    });

}

function initManagementDashboard() {

    const loginButton = document.getElementById("managementLoginBtn");
    const logoutButton = document.getElementById("managementLogout");
    const pinInput = document.getElementById("managementPin");
    const loginStatus = document.getElementById("managementLoginStatus");
    const dashboard = document.getElementById("managementDashboard");
    const loginBox = document.getElementById("managementLogin");
    const panel = document.getElementById("dashboardPanel");

    if (!loginButton || !dashboard) return;

    let adminPin = sessionStorage.getItem("beanMachineAdminPin") || "";

    function bindDashboardTabs(data) {
        dashboard.querySelectorAll(".dashboard-tabs button").forEach(button => {
            button.onclick = () => {
                dashboard.querySelectorAll(".dashboard-tabs button")
                    .forEach(item => item.classList.remove("active"));
                button.classList.add("active");
                panel.innerHTML = '<div class="live-loading">Loading...</div>';
                setTimeout(() => renderDashboardTab(button.dataset.tab, data, panel), 0);
            };
        });
    }

    async function loadDashboard() {

        try {

            const data = await bmGet("admin", { pin: adminPin });

            if (!data.ok) throw new Error(data.error || "Access denied.");

            loginBox.hidden = true;
            dashboard.hidden = false;

            window.BEAN_MACHINE_ADMIN_DATA = data;

            panel.innerHTML = '<div class="live-loading">Loading applications...</div>';
            setTimeout(() => renderDashboardApplications(data.applications || [], panel), 0);

            bindDashboardTabs(data);

        } catch (error) {

            sessionStorage.removeItem("beanMachineAdminPin");

            if (loginStatus) {
                loginStatus.className = "application-status error";
                loginStatus.textContent = "Invalid management PIN or server configuration.";
            }

        }

    }

    if (adminPin) loadDashboard();

    loginButton.addEventListener("click", async () => {

        adminPin = pinInput.value.trim();

        if (!adminPin) {
            loginStatus.textContent = "Enter the management PIN.";
            return;
        }

        loginStatus.textContent = "Checking access...";

        try {

            const data = await bmGet("admin", { pin: adminPin });

            if (!data.ok) throw new Error();

            sessionStorage.setItem("beanMachineAdminPin", adminPin);
            window.BEAN_MACHINE_ADMIN_DATA = data;

            loginBox.hidden = true;
            dashboard.hidden = false;

            panel.innerHTML = '<div class="live-loading">Loading applications...</div>';
            setTimeout(() => renderDashboardApplications(data.applications || [], panel), 0);
            bindDashboardTabs(data);

        } catch (error) {

            loginStatus.className = "application-status error";
            loginStatus.textContent = "Invalid management PIN.";

        }

    });

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            sessionStorage.removeItem("beanMachineAdminPin");

            dashboard.hidden = true;
            loginBox.hidden = false;
            pinInput.value = "";

        });

    }

}

function renderDashboardTab(tab, data, panel) {

    if (tab === "applications") {
        renderDashboardApplications(data.applications || [], panel);
    } else if (tab === "reviews") {
        renderDashboardReviews(data.reviews || [], panel);
    } else if (tab === "employees") {
        renderDashboardEmployees(data.employees || [], panel);
    } else if (tab === "content") {
        renderDashboardContent(data, panel);
    } else if (tab === "settings") {
        renderDashboardSettings(data.settings || {}, panel);
    }

}

function renderDashboardApplications(applications, panel) {

    panel.innerHTML = `
        <div class="dashboard-card-grid">
            <div class="dashboard-stat"><strong>${applications.length}</strong><span>Total Applications</span></div>
            <div class="dashboard-stat"><strong>${applications.filter(x => (bmField(x, "status", "Status") || "Pending") === "Pending").length}</strong><span>Pending</span></div>
            <div class="dashboard-stat"><strong>${applications.filter(x => bmField(x, "status", "Status") === "Accepted").length}</strong><span>Accepted</span></div>
        </div>

        <div class="dashboard-form">
            <input id="applicationSearch" type="search" placeholder="Search name, CID, Discord, phone or family...">
        </div>

        <div id="applicationTable" class="dashboard-table-wrap"></div>
    `;

    const search = panel.querySelector("#applicationSearch");
    const table = panel.querySelector("#applicationTable");

    function draw() {

        const term = (search.value || "").toLowerCase();

        const filtered = applications.filter(item =>
            JSON.stringify(item).toLowerCase().includes(term)
        );

        table.innerHTML = `
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Applicant</th>
                        <th>CID / Discord</th>
                        <th>Family / Gang / Organization / Citizen</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(item => `
                        <tr>
                            <td>${bmEscape(item.Timestamp || item.timestamp || "")}</td>
                            <td><strong>${bmEscape(item["Name (in city)"] || item.name)}</strong><br>${bmEscape(item.Phone || item.phone)}</td>
                            <td>${bmEscape(item.CID || item.cid)}<br>${bmEscape(item["Discord Username"] || item.discord)}</td>
                            <td>${bmEscape(item["Family Name"] || item.family)}</td>
                            <td>${bmEscape(item["Flexible Hours"] || item.flexibleHours)}</td>
                            <td><span class="dashboard-status dashboard-status-${String(bmField(item, "status", "Status") || "Pending").toLowerCase()}">${bmEscape(bmField(item, "status", "Status") || "Pending")}</span></td>
                            <td>
                                <div class="dashboard-action">
                                    <button data-app-action="Interview" data-id="${bmEscape(item._row)}" ${bmField(item, "status", "Status") === "Interview" ? "disabled" : ""}>Interview</button>
                                    <button data-app-action="Accepted" data-id="${bmEscape(item._row)}" ${bmField(item, "status", "Status") === "Accepted" ? "disabled" : ""}>Accept</button>
                                    <button data-app-action="Rejected" data-id="${bmEscape(item._row)}" ${bmField(item, "status", "Status") === "Rejected" ? "disabled" : ""}>Reject</button>
                                    <button data-app-delete="1" data-id="${bmEscape(item._row)}">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        table.querySelectorAll("[data-app-action]").forEach(button => {

            button.addEventListener("click", async () => {

                button.disabled = true;
                try {
                    await bmAdminPost({
                        action: "update_application",
                        pin: sessionStorage.getItem("beanMachineAdminPin"),
                        row: button.dataset.id,
                        status: button.dataset.appAction
                    });
                    await refreshManagementTab("applications", panel);
                    await refreshPublicLiveData();
                } catch (error) {
                    alert(error.message || "Could not update the application.");
                    button.disabled = false;
                }

            });

        });

        table.querySelectorAll("[data-app-delete]").forEach(button => {
            button.addEventListener("click", async () => {
                if (!confirm("Delete this application permanently?")) return;
                button.disabled = true;
                try {
                    await bmAdminPost({ action: "delete_application", pin: sessionStorage.getItem("beanMachineAdminPin"), row: button.dataset.id });
                    await refreshManagementTab("applications", panel);
                } catch (error) {
                    alert(error.message || "Could not delete the application.");
                    button.disabled = false;
                }
            });
        });

    }

    search.addEventListener("input", draw);

    draw();

}

function renderDashboardReviews(reviews, panel) {

    panel.innerHTML = `
        <div class="dashboard-form">
            <input id="reviewSearch" type="search" placeholder="Search employee, reviewer or message...">
        </div>
        <div id="reviewTable" class="dashboard-table-wrap"></div>
    `;

    const search = panel.querySelector("#reviewSearch");
    const table = panel.querySelector("#reviewTable");

    function draw() {

        const term = (search.value || "").toLowerCase();

        const filtered = reviews.filter(item =>
            JSON.stringify(item).toLowerCase().includes(term)
        );

        table.innerHTML = `
            <table class="dashboard-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Employee</th>
                        <th>Rating</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Moderation</th>
                    </tr>
                </thead>
                <tbody>
                    ${filtered.map(item => `
                        <tr>
                            <td>${bmEscape(item.Timestamp || "")}</td>
                            <td>${bmEscape(bmField(item, "employee", "Employee"))}</td>
                            <td>${bmStars(Number(bmField(item, "rating", "Rating")))}</td>
                            <td>${bmEscape(bmField(item, "reviewType", "Feedback Type"))}</td>
                            <td>${bmEscape(bmField(item, "message", "Message"))}</td>
                            <td>
                                <div><span class="dashboard-status dashboard-status-${String(bmField(item, "status", "Status") || "Pending").toLowerCase()}">${bmEscape(bmField(item, "status", "Status") || "Pending")}</span></div>
                                <div class="dashboard-action">
                                    <button data-review-action="Approved" data-id="${bmEscape(item._row)}" ${bmField(item, "status", "Status") === "Approved" ? "disabled" : ""}>Approve</button>
                                    <button data-review-action="Rejected" data-id="${bmEscape(item._row)}" ${bmField(item, "status", "Status") === "Rejected" ? "disabled" : ""}>Reject</button>
                                    <button data-review-delete="1" data-id="${bmEscape(item._row)}">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;

        table.querySelectorAll("[data-review-action]").forEach(button => {

            button.addEventListener("click", async () => {

                button.disabled = true;
                try {
                    await bmAdminPost({
                        action: "moderate_review",
                        pin: sessionStorage.getItem("beanMachineAdminPin"),
                        row: button.dataset.id,
                        status: button.dataset.reviewAction
                    });
                    await refreshManagementTab("reviews", panel);
                    await refreshPublicLiveData();
                } catch (error) {
                    alert(error.message || "Could not moderate the review.");
                    button.disabled = false;
                }

            });

        });

        table.querySelectorAll("[data-review-delete]").forEach(button => {
            button.addEventListener("click", async () => {
                if (!confirm("Delete this review permanently?")) return;
                button.disabled = true;
                try {
                    await bmAdminPost({ action: "delete_review", pin: sessionStorage.getItem("beanMachineAdminPin"), row: button.dataset.id });
                    await refreshManagementTab("reviews", panel);
                    await refreshPublicLiveData();
                } catch (error) {
                    alert(error.message || "Could not delete the review.");
                    button.disabled = false;
                }
            });
        });

    }

    search.addEventListener("input", draw);

    draw();

}

function renderDashboardEmployees(employees, panel) {

    panel.innerHTML = `
        <h3>Employee Profiles</h3>

        <form id="employeeForm" class="dashboard-form">
            <input name="name" placeholder="Employee name" required>
            <input name="rank" placeholder="Rank" required>
            <input name="photo" placeholder="Photo URL or Google Drive link" required>
            <textarea name="bio" placeholder="Employee bio"></textarea>
            <button type="submit">Save Employee</button>
        </form>

        <div class="dashboard-table-wrap">
            <table class="dashboard-table">
                <thead>
                    <tr><th>Name</th><th>Rank</th><th>Rating</th><th>Action</th></tr>
                </thead>
                <tbody>
                    ${employees.map(item => `
                        <tr>
                            <td>${bmEscape(bmField(item, "name", "Name"))}</td>
                            <td>${bmEscape(bmField(item, "rank", "Rank"))}</td>
                            <td>${Number(bmField(item, "rating", "Rating") || 0).toFixed(1)}</td>
                            <td><button data-employee-row="${bmEscape(item._row)}">Delete</button></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;

    panel.querySelector("#employeeForm").addEventListener("submit", async event => {

        event.preventDefault();

        const formData = Object.fromEntries(new FormData(event.target).entries());

        try {
            await bmAdminPost({
                action: "save_employee",
                pin: sessionStorage.getItem("beanMachineAdminPin"),
                ...formData
            });
            event.target.reset();
            await refreshManagementTab("employees", panel);
            await refreshPublicLiveData();
        } catch (error) {
            alert(error.message || "Could not save the employee.");
        }

    });

    panel.querySelectorAll("[data-employee-row]").forEach(button => {

        button.addEventListener("click", async () => {

            if (!confirm("Delete this employee profile permanently?")) return;
            try {
                await bmAdminPost({
                    action: "delete_employee",
                    pin: sessionStorage.getItem("beanMachineAdminPin"),
                    row: button.dataset.employeeRow
                });
                await refreshManagementTab("employees", panel);
                await refreshPublicLiveData();
            } catch (error) {
                alert("Could not delete the employee. Please try again.");
            }

        });

    });

}

function renderDashboardContent(data, panel) {

    panel.innerHTML = `
        <h3>Employee of the Month</h3>

        <form id="eomForm" class="dashboard-form">
            <input name="month" placeholder="Month e.g. September 2026" required>
            <input name="name" placeholder="Employee name" required>
            <input name="rank" placeholder="Rank">
            <input name="photo" placeholder="Photo URL">
            <textarea name="message" placeholder="Award message"></textarea>
            <textarea name="highlight" placeholder="Highlight / reason"></textarea>
            <button type="submit">Set Employee of the Month</button>
        </form>

        <h3 style="margin-top:30px;">Announcements</h3>

        <form id="announcementForm" class="dashboard-form">
            <input name="title" placeholder="Announcement title" required>
            <textarea name="message" placeholder="Announcement message" required></textarea>
            <input name="date" placeholder="Date">
            <button type="submit">Publish Announcement</button>
        </form>

        <h3 style="margin-top:30px;">Events</h3>

        <form id="eventForm" class="dashboard-form">
            <input name="title" placeholder="Event title" required>
            <input name="date" placeholder="Date" required>
            <input name="time" placeholder="Time">
            <input name="location" placeholder="Location">
            <textarea name="description" placeholder="Description"></textarea>
            <button type="submit">Add Event</button>
        </form>

        <h3 style="margin-top:30px;">Menu Item</h3>

        <form id="menuForm" class="dashboard-form">
            <input name="name" placeholder="Item name" required>
            <input name="price" placeholder="Price">
            <input name="image" placeholder="Image URL">
            <textarea name="description" placeholder="Description"></textarea>
            <button type="submit">Add Menu Item</button>
        </form>

        <h3 style="margin-top:30px;">Gallery Image</h3>

        <form id="galleryForm" class="dashboard-form">
            <input name="title" placeholder="Gallery title">
            <input name="image" placeholder="Image URL" required>
            <button type="submit">Add Gallery Image</button>
        </form>

        <div class="dashboard-content-preview">
            <h3 style="margin-top:30px;">Current Content</h3>
            <div class="dashboard-card-grid">
                <div class="dashboard-stat"><strong>${(data.employeeOfMonth || []).length}</strong><span>Employee of Month Records</span></div>
                <div class="dashboard-stat"><strong>${(data.announcements || []).length}</strong><span>Announcements</span></div>
                <div class="dashboard-stat"><strong>${(data.events || []).length}</strong><span>Events</span></div>
                <div class="dashboard-stat"><strong>${(data.menu || []).length}</strong><span>Managed Menu Items</span></div>
                <div class="dashboard-stat"><strong>${(data.gallery || []).length}</strong><span>Managed Gallery Images</span></div>
            </div>
        </div>
    `;

    bindContentForm("eomForm", "save_eom");
    bindContentForm("announcementForm", "save_announcement");
    bindContentForm("eventForm", "save_event");
    bindContentForm("menuForm", "save_menu");
    bindContentForm("galleryForm", "save_gallery");

}

function bindContentForm(formId, action) {

    const form = document.getElementById(formId);

    if (!form) return;

    form.addEventListener("submit", async event => {

        event.preventDefault();

        const values = Object.fromEntries(new FormData(form).entries());

        try {
            await bmAdminPost({
                action,
                pin: sessionStorage.getItem("beanMachineAdminPin"),
                ...values
            });
            form.reset();
            await refreshManagementTab("content", document.getElementById("dashboardPanel"));
            await refreshPublicLiveData();
            const note = document.createElement("div");
            note.className = "application-status success";
            note.textContent = "Saved successfully. The public content has been refreshed.";
            form.after(note);
        } catch (error) {
            const note = document.createElement("div");
            note.className = "application-status error";
            note.textContent = error.message || "Could not save this content.";
            form.after(note);
        }

    });

}

function renderDashboardSettings(settings, panel) {

    const checked = key =>
        String(settings[key] || "").toLowerCase() === "true" ? "checked" : "";

    panel.innerHTML = `
        <h3>Website & Discord Settings</h3>

        <form id="settingsForm" class="dashboard-form">

            <label>
                <input type="checkbox" name="notifyApplications" ${checked("notifyApplications")}>
                Discord notifications for applications
            </label>

            <label>
                <input type="checkbox" name="notifyReviews" ${checked("notifyReviews")}>
                Discord notifications for staff feedback
            </label>

            <label>
                <input type="checkbox" name="notifyContact" ${checked("notifyContact")}>
                Discord notifications for contact messages
            </label>

            <label>
                <input type="checkbox" name="notifyNewsletter" ${checked("notifyNewsletter")}>
                Discord notifications for newsletter subscriptions
            </label>

            <label>
                <input type="checkbox" name="maintenanceEnabled" ${checked("maintenanceEnabled")}>
                Maintenance mode
            </label>

            <input name="maintenanceMessage" value="${bmEscape(settings.maintenanceMessage || "Bean Machine website is currently under maintenance.")}" placeholder="Maintenance message">

            <button type="submit">Save Settings</button>

        </form>

        <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <button type="button" id="testApplicationWebhook" class="dashboard-button">Test Application Webhook</button>
            <span id="webhookTestStatus" class="application-status" role="status" aria-live="polite"></span>
        </div>

        <p style="margin-top:18px;color:#999;">
            Discord webhook URLs remain private in Apps Script Script Properties.
        </p>
    `;

    panel.querySelector("#settingsForm").addEventListener("submit", async event => {

        event.preventDefault();

        const form = new FormData(event.target);

        try {
            await bmAdminPost({
                action: "save_settings",
                pin: sessionStorage.getItem("beanMachineAdminPin"),
                notifyApplications: form.get("notifyApplications") === "on",
                notifyReviews: form.get("notifyReviews") === "on",
                notifyContact: form.get("notifyContact") === "on",
                notifyNewsletter: form.get("notifyNewsletter") === "on",
                maintenanceEnabled: form.get("maintenanceEnabled") === "on",
                maintenanceMessage: form.get("maintenanceMessage") || ""
            });

            await refreshPublicLiveData();
            const fresh = await bmGet("admin", { pin: sessionStorage.getItem("beanMachineAdminPin") });
            window.BEAN_MACHINE_ADMIN_DATA = fresh;
            event.target.insertAdjacentHTML(
                "afterend",
                '<div class="application-status success">Settings saved successfully.</div>'
            );
        } catch (error) {
            event.target.insertAdjacentHTML(
                "afterend",
                '<div class="application-status error">Could not save settings. Please try again.</div>'
            );
        }

    });

    const testButton = panel.querySelector("#testApplicationWebhook");
    const testStatus = panel.querySelector("#webhookTestStatus");

    if (testButton) {
        testButton.addEventListener("click", async () => {
            testButton.disabled = true;
            if (testStatus) {
                testStatus.className = "application-status";
                testStatus.textContent = "Testing...";
            }

            try {
                const result = await bmGet("test_webhook", {
                    pin: sessionStorage.getItem("beanMachineAdminPin"),
                    type: "APPLICATIONS"
                });

                if (!result.ok) throw new Error(result.error || "Webhook test failed.");

                if (testStatus) {
                    testStatus.className = "application-status success";
                    testStatus.textContent = "Application webhook is working.";
                }
            } catch (error) {
                if (testStatus) {
                    testStatus.className = "application-status error";
                    testStatus.textContent = error.message || "Webhook test failed.";
                }
            } finally {
                testButton.disabled = false;
            }
        });
    }

}
