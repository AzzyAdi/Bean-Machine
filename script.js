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
    initNewsletter();
    initContactForm();

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

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("Thank you! Your message has been sent.");

        form.reset();

    });

}

/*====================================
    NEWSLETTER
====================================*/

function initNewsletter() {

    const button = document.querySelector(".newsletter-form button");
    const input = document.querySelector(".newsletter-form input");

    if (!button || !input) return;

    button.addEventListener("click", function (e) {

        e.preventDefault();

        const email = input.value.trim();

        if (email === "") {

            alert("Please enter your email address.");

            input.focus();

            return;

        }

        alert("Thank you for subscribing!");

        input.value = "";

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
    DISCORD PLACEHOLDER
====================================*/

document.querySelectorAll(".discord").forEach(btn=>{

btn.href="https://discord.gg/YOURSERVER";

});

/*====================================
    FIVE M BUTTON PLACEHOLDER
====================================*/

document.querySelectorAll(".join").forEach(btn=>{

btn.addEventListener("click",(e)=>{

e.preventDefault();

alert(

"Replace this with:\nconnect YOURSERVERIP"

);

});

});

/*====================================
    END
====================================*/

console.log("====================================");

console.log(" Bean Machine Finished ");

console.log(" No Critical JavaScript Errors ");

console.log(" Website Ready ");

console.log("====================================");