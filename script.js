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

/* =====================================================================
   Mekong Pack Solutions - working features (all pages)
   Search, category filter, clickable cards/buttons, enquiry form.
   No design changes: it only adds behaviour (plus a few invisible
   accessibility helpers).
   ===================================================================== */
(function () {
    "use strict";

    /* ---- Contact form settings (fill ONE in to really receive enquiries) ----
       CONTACT_EMAIL : opens the visitor's email app addressed to you
       FORM_ENDPOINT : a form service URL (e.g. Formspree) that accepts a POST
       Leave both empty = demo mode (form validates and shows a thank-you only) */
    var CONFIG = { CONTACT_EMAIL: "", FORM_ENDPOINT: "" };

    /* ---- tiny CSS: cursor + keyboard focus ring + helpers (no layout change) ---- */
    var css = "\
[data-href], .mp-clickable, .mp-card-link { cursor:pointer; }\
.mp-hide { display:none !important; }\
.mp-sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }\
.mp-empty { grid-column:1 / -1; text-align:center; padding:48px 16px; font-size:14px; color:#6B7280; }\
.mp-empty strong { color:#7C3AED; }\
a:focus-visible, button:focus-visible, select:focus-visible, [role='link']:focus-visible, [role='button']:focus-visible,\
header > p:focus-visible, footer > p:focus-visible { outline:2px solid #7C3AED; outline-offset:2px; }\
";
    var st = document.createElement("style");
    st.setAttribute("data-mp", "features");
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);

    function qs(s, r) { return (r || document).querySelector(s); }
    function qa(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
    function file(path) {
        var n = String(path || "").split("#")[0].split("?")[0].split("/").pop().toLowerCase();
        return n === "" ? "index.html" : n;
    }

    function init() {
        var here = file(location.pathname);
        var params = new URLSearchParams(location.search);

        /* ---------- Make non-link elements keyboard + mouse friendly ---------- */
        function makeButton(el, label, fn) {
            if (!el) return;
            el.setAttribute("role", el.getAttribute("role") || "button");
            if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "0");
            if (label && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
            el.classList.add("mp-clickable");
            el.addEventListener("click", fn);
            el.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); }
            });
        }

        /* ---------- Logo: header goes Home, footer scrolls to top ---------- */
        var hLogo = qs("header > p");
        if (hLogo) {
            hLogo.setAttribute("data-href", "index.html");
            hLogo.setAttribute("role", "link");
            hLogo.setAttribute("tabindex", "0");
            hLogo.setAttribute("aria-label", "Mekong Pack Solutions - Home");
        }
        makeButton(qs("footer > p"), "Back to top", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        /* ---------- Generic [data-href] elements (click / Enter / Space) ---------- */
        qa("[data-href]").forEach(function (el) {
            function go() {
                var url = el.getAttribute("data-href");
                if (file(url) === here && url.indexOf("?") === -1) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                    location.href = url;
                }
            }
            el.addEventListener("click", go);
            el.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
            });
        });

        /* ---------- Whole product card is clickable (follows its Explore link) ---------- */
        qa(".main-card, .box-list, .container-pic-product").forEach(function (card) {
            var link = qs("a[href]", card);
            if (!link && !qs("[data-href]", card)) return;
            card.classList.add("mp-card-link");
            card.addEventListener("click", function (e) {
                if (e.target.closest("a, button, input, select, [data-href]")) return;
                if (link) link.click();
            });
        });

        /* ================= HOME: search box ================= */
        var homeSearch = qs(".container-products > input");
        if (homeSearch) {
            var goSearch = function () {
                var q = homeSearch.value.trim();
                location.href = "products.html" + (q ? "?q=" + encodeURIComponent(q) : "");
            };
            homeSearch.addEventListener("keydown", function (e) {
                if (e.key === "Enter") { e.preventDefault(); goSearch(); }
            });
            // The magnifier / filter icons are drawn inside the input's background
            homeSearch.addEventListener("mousemove", function (e) {
                var x = e.offsetX, w = homeSearch.clientWidth;
                homeSearch.style.cursor = (x < 44 || x > w - 44) ? "pointer" : "text";
            });
            homeSearch.addEventListener("click", function (e) {
                var x = e.offsetX, w = homeSearch.clientWidth;
                if (x < 44 || x > w - 44) goSearch();
            });
        }

        /* ================= PRODUCTS: live search + category filter ================= */
        var grid = qs(".card-grid");
        var cards = qa(".main-card");
        var input = qs(".search-box input");
        var select = qs("#sort");

        if (grid && cards.length && input) {
            var CATS = { meals: "meals", snacks: "snacks", drink: "drink", burger: "burger" };
            var ALIAS = { truffle: "traffle", takaway: "takeaway" };   // spelling variants

            cards.forEach(function (c) {
                c._txt = qa(".tittle h4, .tittle h1, .tittle p", c)
                    .map(function (n) { return n.textContent; }).join(" ")
                    .replace(/\s+/g, " ").toLowerCase();
            });

            var empty = document.createElement("p");
            empty.className = "mp-empty mp-hide";
            grid.appendChild(empty);

            var status = document.createElement("div");
            status.className = "mp-sr";
            status.setAttribute("role", "status");
            status.setAttribute("aria-live", "polite");
            grid.parentNode.insertBefore(status, grid);

            var apply = function () {
                var raw = input.value.trim();
                var terms = raw.toLowerCase().split(/\s+/).filter(Boolean)
                    .map(function (t) { return ALIAS[t] || t; });
                var cat = select ? select.value : "popular";
                var shown = 0;

                cards.forEach(function (c) {
                    var ok = terms.every(function (t) { return c._txt.indexOf(t) > -1; }) &&
                             (!CATS[cat] || c._txt.indexOf(CATS[cat]) > -1);
                    c.classList.toggle("mp-hide", !ok);
                    if (ok) shown++;
                });

                if (shown === 0) {
                    empty.textContent = "";
                    empty.appendChild(document.createTextNode("No products found"));
                    if (raw) {
                        empty.appendChild(document.createTextNode(" for "));
                        var b = document.createElement("strong");
                        b.textContent = "\u201C" + raw + "\u201D";
                        empty.appendChild(b);
                    }
                    empty.appendChild(document.createTextNode(". Try a different word or category."));
                }
                empty.classList.toggle("mp-hide", shown > 0);
                status.textContent = shown + (shown === 1 ? " product" : " products") + " shown";
            };

            input.addEventListener("input", apply);
            input.addEventListener("keydown", function (e) {
                if (e.key === "Enter") e.preventDefault();
                if (e.key === "Escape" && input.value) { input.value = ""; apply(); }
            });
            if (select) select.addEventListener("change", apply);

            // Magnifier focuses + runs the search, filter icon opens the category list
            var icons = qa(".search-box i");
            makeButton(icons[0], "Search", function () { input.focus(); apply(); });
            makeButton(icons[1], "Filter by category", function () {
                if (!select) return;
                select.focus();
                try { if (select.showPicker) select.showPicker(); } catch (err) { /* ignore */ }
            });

            // Arrived from the home page search (?q=burger)
            var q = params.get("q");
            if (q) input.value = q;
            apply();

            // Explore on each product -> enquiry form with that product pre-filled
            cards.forEach(function (c) {
                var a = qs(".tittle h3 a", c);
                if (!a) return;
                var name = (qs("h1", c) || {}).textContent || "";
                var kind = (qs(".tittle p", c) || {}).textContent || "";
                var label = (name.trim() + (kind ? " - " + kind.trim() : "")).trim();
                a.setAttribute("href", "contact.html?product=" + encodeURIComponent(label));
                a.setAttribute("aria-label", "Explore " + label);
            });
        }

        /* ================= CONTACT: enquiry form ================= */
        var form = qs(".contact-form form");
        if (form) {
            var nameEl = qs("#name", form), msgEl = qs("#message", form);
            var btn = qs(".submit-btn", form);

            var msg = document.createElement("p");
            msg.className = "note mp-hide";
            msg.setAttribute("role", "status");
            msg.setAttribute("aria-live", "polite");
            var oldNote = qs(".note", form);
            (oldNote || btn).insertAdjacentElement("afterend", msg);

            function say(text, good) {
                msg.textContent = text;
                msg.classList.remove("mp-hide");
                msg.style.color = good ? "#7C3AED" : "#B91C1C";
            }

            // Arrived from a product's Explore link
            var product = params.get("product");
            if (product && msgEl && !msgEl.value.trim()) {
                msgEl.value = "Hello, I would like to enquire about: " + product +
                              ".\nQuantity:\nIntended use:";
                setTimeout(function () {
                    form.scrollIntoView({ behavior: "smooth", block: "center" });
                    if (nameEl) nameEl.focus({ preventScroll: true });
                }, 150);
            }

            form.addEventListener("submit", function (e) {
                e.preventDefault();               // runs only after native required/email checks pass
                var data = {};
                qa("input, textarea", form).forEach(function (f) { if (f.name) data[f.name] = f.value.trim(); });

                if (!data.name || !data.message) {
                    say("Please fill in your name and message.", false);
                    (data.name ? msgEl : nameEl).focus();
                    return;
                }

                var label = btn.textContent;
                btn.disabled = true;
                btn.textContent = "Sending...";

                function finish(ok, text) {
                    btn.disabled = false;
                    btn.textContent = label;
                    say(text, ok);
                    if (ok) form.reset();
                }

                if (CONFIG.FORM_ENDPOINT) {
                    fetch(CONFIG.FORM_ENDPOINT, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "Accept": "application/json" },
                        body: JSON.stringify(data)
                    }).then(function (r) {
                        finish(r.ok, r.ok ? "Thank you! Your enquiry has been sent. We will reply soon."
                                          : "Sorry, something went wrong. Please try again.");
                    }).catch(function () {
                        finish(false, "Could not send. Please check your connection and try again.");
                    });
                } else if (CONFIG.CONTACT_EMAIL) {
                    var body = "Name: " + data.name + "\nEmail: " + data.email +
                               "\nCompany: " + (data.company || "-") + "\nPhone: " + (data.phone || "-") +
                               "\n\n" + data.message;
                    location.href = "mailto:" + CONFIG.CONTACT_EMAIL +
                        "?subject=" + encodeURIComponent("Website enquiry from " + data.name) +
                        "&body=" + encodeURIComponent(body);
                    finish(true, "Thank you! Your email app should open so you can send the enquiry.");
                } else {
                    finish(true, "Thank you! Your enquiry was received. (Demo mode: no live submission is connected yet.)");
                }
            });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
