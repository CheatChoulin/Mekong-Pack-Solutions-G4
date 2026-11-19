/* =====================================================================
   Mekong Pack Solutions - animations + nav underline (all pages)
   One file does everything: it adds its own CSS, so no other file is needed.
   ===================================================================== */
(function () {
    "use strict";

    /* ---------- 1. CSS (injected so it always loads together with the script) ---------- */
    var css = `
@keyframes mp-from-left   { from { opacity:0; transform:translateX(-80px); } to { opacity:1; transform:none; } }
@keyframes mp-from-right  { from { opacity:0; transform:translateX(80px);  } to { opacity:1; transform:none; } }
@keyframes mp-from-top    { from { opacity:0; transform:translateY(-40px); } to { opacity:1; transform:none; } }
@keyframes mp-from-bottom { from { opacity:0; transform:translateY(50px);  } to { opacity:1; transform:none; } }
@keyframes mp-grow-up     { from { transform:scaleY(0); } to { transform:scaleY(1); } }
@keyframes mp-grow-x      { from { transform:scaleX(0); } to { transform:scaleX(1); } }
@keyframes mp-float       { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }

/* Page load */
header { animation: mp-from-top .7s ease-out backwards; }

.hero-section .left-con > * { animation: mp-from-left .9s ease-out backwards; }
.hero-section .left-con > *:nth-child(1) { animation-delay:.15s; }
.hero-section .left-con > *:nth-child(2) { animation-delay:.30s; }
.hero-section .left-con > *:nth-child(3) { animation-delay:.45s; }
.hero-section .left-con > *:nth-child(4) { animation-delay:.60s; }
.hero-section > img { animation: mp-from-right 1s ease-out .25s backwards; }

.about-text > * { animation: mp-from-left .9s ease-out backwards; }
.about-text > *:nth-child(1) { animation-delay:.15s; }
.about-text > *:nth-child(2) { animation-delay:.30s; }
.about-text > *:nth-child(3) { animation-delay:.45s; }
.about-text > *:nth-child(4) { animation-delay:.55s; }
.about-text > *:nth-child(5) { animation-delay:.65s; }
.about-text > *:nth-child(6) { animation-delay:.75s; }

/* Scroll reveal: hidden only while JS is running */
.mp-js .mp-reveal { opacity:0; }
.mp-js .mp-reveal.mp-in {
    opacity:1;
    animation-duration:.9s;
    animation-timing-function:ease-out;
    animation-fill-mode:backwards;
    animation-delay:var(--mp-delay,0s);
}
.mp-js .mp-reveal.mp-left.mp-in  { animation-name:mp-from-left; }
.mp-js .mp-reveal.mp-right.mp-in { animation-name:mp-from-right; }
.mp-js .mp-reveal.mp-up.mp-in    { animation-name:mp-from-bottom; }

/* Home page extras */
.shapes-container > div { transform-origin:bottom; }
.container-total.mp-in .shapes-container > div { animation: mp-grow-up .8s ease-out backwards; }
.container-total.mp-in .shape1 { animation-delay:.10s; }
.container-total.mp-in .shape2 { animation-delay:.20s; }
.container-total.mp-in .shape3 { animation-delay:.30s; }
.container-total.mp-in .shape4 { animation-delay:.40s; }
.container-total.mp-in .shape5 { animation-delay:.50s; }
.container-total.mp-in .shape6 { animation-delay:.60s; }
.container-total.mp-in .shape7 { animation-delay:.70s; }
.container-total.mp-in .shape8 { animation-delay:.80s; }
.shape-2 { transform-origin:left; }
.containter-last.mp-in .shape-2 { animation: mp-grow-x 1.2s ease-out .4s backwards; }
.container-pic-product > img { animation: mp-float 5s ease-in-out infinite; }

/* Nav: underline stays on the current / clicked link */
header nav a.mp-active { color:#7C3AED !important; }
header nav a.mp-active::after {
    width:100% !important;
    transform-origin:left;
    animation: mp-grow-x .45s ease-out;
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation:none !important; transition:none !important; }
    .mp-js .mp-reveal { opacity:1; }
}
`;

    var style = document.createElement("style");
    style.setAttribute("data-mp", "animations");
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
    document.documentElement.classList.add("mp-js");

    /* ---------- helpers ---------- */
    // "/folder/About.html?x#y" -> "about"   ,   "/" -> "index"
    function pageKey(path) {
        var name = String(path || "").split("#")[0].split("?")[0].split("/").pop().toLowerCase();
        name = name.replace(/\.html?$/, "");
        return name === "" ? "index" : name;
    }

    function init() {
        /* ---------- 2. Nav underline ---------- */
        var navLinks = Array.prototype.slice.call(document.querySelectorAll("header nav a"));
        var current = pageKey(location.pathname);

        function setActive(link) {
            navLinks.forEach(function (a) { a.classList.remove("mp-active"); });
            if (link) link.classList.add("mp-active");
        }

        var match = null;
        navLinks.forEach(function (a) {
            var href = a.getAttribute("href");
            if (!match && href && href !== "#" && pageKey(href) === current) match = a;
        });
        if (!match) {
            navLinks.forEach(function (a) {
                if (!match && pageKey(a.getAttribute("href")) === "index" && current === "index") match = a;
            });
        }
        setActive(match);

        navLinks.forEach(function (link) {
            link.addEventListener("click", function (e) {
                var href = link.getAttribute("href");
                var empty = !href || href === "#";
                // Empty links or the page you're already on: don't reload, just move the underline
                if (empty || pageKey(href) === current) e.preventDefault();
                setActive(link);
            });
        });

        /* ---------- 3. Scroll reveal ---------- */
        function reveal(selector, dir, step, base, modulo) {
            step = step === undefined ? 0.12 : step;
            base = base || 0;
            Array.prototype.forEach.call(document.querySelectorAll(selector), function (el, i) {
                var d = typeof dir === "function" ? dir(i) : dir;
                var n = modulo ? i % modulo : i;
                el.classList.add("mp-reveal", d);
                el.style.setProperty("--mp-delay", (base + n * step) + "s");
            });
        }

        var L = "mp-left", R = "mp-right", U = "mp-up";

        // Home
        reveal(".container-products", L);
        reveal(".container-pic-product", R);
        reveal(".box-list", function (i) { return i % 2 ? R : L; });
        reveal(".container-growing > h3", L);
        reveal(".container-growing > p", L, 0.12, 0.1);
        reveal(".btn-growing", R, 0.12, 0.1);
        reveal(".container-total", U);
        reveal(".container-growing-bottom", U);
        reveal(".containter-last", U);
        // About
        reveal(".label", U);
        reveal(".about-section > h2", U);
        reveal(".cards .card", function (i) { return [L, U, R][i % 3]; }, 0.15);
        reveal(".serve-text", L);
        reveal(".serve-image", R);
        reveal(".serve-banner", U);
        // Products
        reveal(".toolbar", U);
        reveal(".main-card", function (i) { return i % 2 ? R : L; }, 0.1, 0, 4);
        // Footer (all pages)
        reveal("footer .left-footer", L);
        reveal("footer .middle-footer", U, 0.12, 0.1);
        reveal("footer .right-footer", R, 0.12, 0.2);

        var items = document.querySelectorAll(".mp-reveal");

        function show(el) { el.classList.add("mp-in"); }

        if ("IntersectionObserver" in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        show(entry.target);
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
            Array.prototype.forEach.call(items, function (el) { io.observe(el); });
        } else {
            Array.prototype.forEach.call(items, show);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
/* =====================================================================
   Mekong Pack Solutions - nav underline + scroll animations (all pages)
   Works together with animation.css
   ===================================================================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ---------- helper: "/folder/About.html?x#y" -> "about", "/" -> "index" ---------- */
    function pageKey(path) {
        let name = String(path || "").split("#")[0].split("?")[0].split("/").pop().toLowerCase();
        name = name.replace(/\.html?$/, "");
        return name === "" ? "index" : name;
    }
    const isRealLink = (href) => !!href && href !== "#";
    const current = pageKey(location.pathname);

    /* ===== Nav: underline follows the current page and moves when you click ===== */
    const navLinks = Array.from(document.querySelectorAll("header nav a"));
    const contactBtn = document.querySelector("header .btn-header");
    const contactLink = contactBtn ? contactBtn.querySelector("a") : null;

    function setActive(link) {
        navLinks.forEach((a) => a.classList.remove("active"));
        if (contactBtn) contactBtn.classList.remove("active");
        if (!link) return;
        if (link === contactLink) contactBtn.classList.add("active");
        else link.classList.add("active");
    }

    // Highlight the link that matches the page we are on
    const match =
        navLinks.find((a) => isRealLink(a.getAttribute("href")) && pageKey(a.getAttribute("href")) === current) ||
        (contactLink && isRealLink(contactLink.getAttribute("href")) && pageKey(contactLink.getAttribute("href")) === current
            ? contactLink
            : null);
    setActive(match);

    // Clicking: move the underline now; don't reload if it's the same page or an empty link
    navLinks.concat(contactLink ? [contactLink] : []).forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href");
            const real = isRealLink(href);
            if (!real || pageKey(href) === current) e.preventDefault();
            if (!real && link === contactLink) return; // Contact button has no page yet: do nothing
            setActive(link);
        });
    });

    /* ===== Scroll reveal animations ===== */
    function reveal(selector, dir, step = 0.12, base = 0, modulo = 0) {
        document.querySelectorAll(selector).forEach((el, i) => {
            const d = typeof dir === "function" ? dir(i) : dir;
            const n = modulo ? i % modulo : i;
            el.classList.add("reveal", d);
            el.style.setProperty("--delay", `${base + n * step}s`);
        });
    }

    // Home
    reveal(".container-products", "reveal-left");
    reveal(".container-pic-product", "reveal-right");
    reveal(".box-list", (i) => (i % 2 ? "reveal-right" : "reveal-left"));
    reveal(".container-growing > h3", "reveal-left");
    reveal(".container-growing > p", "reveal-left", 0.12, 0.1);
    reveal(".btn-growing", "reveal-right", 0.12, 0.1);
    reveal(".container-total", "reveal-up");
    reveal(".container-growing-bottom", "reveal-up");
    reveal(".containter-last", "reveal-up");

    // About
    reveal(".label", "reveal-up");
    reveal(".about-section > h2", "reveal-up");
    reveal(".cards .card", (i) => ["reveal-left", "reveal-up", "reveal-right"][i % 3], 0.15);
    reveal(".serve-text", "reveal-left");
    reveal(".serve-image", "reveal-right");
    reveal(".serve-banner", "reveal-up");

    // Products
    reveal(".toolbar", "reveal-up");
    reveal(".main-card", (i) => (i % 2 ? "reveal-right" : "reveal-left"), 0.1, 0, 4);

    // Contact
    reveal(".contact-form > h2", "reveal-left");
    reveal(".contact-form > .description", "reveal-left", 0.12, 0.1);
    reveal(".enquiry-type", "reveal-left", 0.12, 0.15);
    reveal(".form-group", "reveal-up", 0.12, 0.1, 2);
    reveal(".privacy-text", "reveal-up");
    reveal(".submit-btn", "reveal-up");
    reveal(".note", "reveal-up", 0.12, 0.1);
    reveal(".contact-info", "reveal-right");
    reveal(".partnership-container", "reveal-up");

    // Footer (all pages)
    reveal("footer .left-footer", "reveal-left");
    reveal("footer .middle-footer", "reveal-up", 0.12, 0.1);
    reveal("footer .right-footer", "reveal-right", 0.12, 0.2);

    const items = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
        );
        items.forEach((el) => observer.observe(el));
    } else {
        items.forEach((el) => el.classList.add("is-visible"));
    }
});