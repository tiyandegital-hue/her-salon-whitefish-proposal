/* HER Salon — shared interactions
   ============================================================
   THE ONE SWAPPABLE CONSTANT: change these six values and the
   whole site re-brands (name, address, map link). Everything
   else reads from the [data-her] slots below.
   ============================================================ */
const HER = {
  name: "HER Salon",
  street: "231 E 1st St, Suite D",
  cityState: "Whitefish, MT 59937",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=HER+Salon+231+E+1st+St+Whitefish+MT+59937",
  schedulicityNote: "The salon books through Schedulicity — their real booking link connects here.",
  year: new Date().getFullYear()
};

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  /* business-name slots */
  const slots = {
    name: document.querySelectorAll("[data-her='name']"),
    street: document.querySelectorAll("[data-her='street']"),
    city: document.querySelectorAll("[data-her='city']"),
    maps: document.querySelectorAll("[data-her='maps']"),
    year: document.querySelectorAll("[data-her='year']")
  };
  slots.name.forEach(el => el.textContent = HER.name);
  slots.street.forEach(el => el.textContent = HER.street);
  slots.city.forEach(el => el.textContent = HER.cityState);
  slots.maps.forEach(el => el.href = HER.mapsUrl);
  slots.year.forEach(el => el.textContent = HER.year);

  /* mobile nav — state machine: closed <-> open */
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
      }));
  }

  /* scroll reveals — decorative only, content readable without JS.
     ?static=1 disables motion for QA screenshots (final state, no transitions). */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = document.querySelectorAll(".rv");
  const revealAll = () => els.forEach(el => el.classList.add("in"));
  const qaStatic = new URLSearchParams(window.location.search).has("static");
  if (qaStatic) {
    document.documentElement.classList.add("qa-static");
    revealAll();
  } else if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    /* safety: if the observer never fires (broken IO), never leave content hidden */
    setTimeout(() => {
      if (!document.querySelector(".rv.in")) revealAll();
    }, 1500);
  } else {
    revealAll();
  }

  /* accordion (services) */
  document.querySelectorAll(".acc-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".acc-item");
      const panel = item.querySelector(".acc-panel");
      const open = btn.getAttribute("aria-expanded") === "true";
      // close siblings (one idea open at a time)
      item.parentElement.querySelectorAll(".acc-btn[aria-expanded='true']").forEach(other => {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.closest(".acc-item").querySelector(".acc-panel").style.maxHeight = "0px";
        }
      });
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      panel.style.maxHeight = open ? "0px" : panel.scrollHeight + "px";
    });
  });
  // open first accordion item by default
  const firstAcc = document.querySelector(".acc-btn");
  if (firstAcc) firstAcc.click();

  /* gallery filter */
  const chips = document.querySelectorAll(".chip");
  const tiles = document.querySelectorAll(".gtile");
  chips.forEach(chip => chip.addEventListener("click", () => {
    chips.forEach(c => c.setAttribute("aria-pressed", "false"));
    chip.setAttribute("aria-pressed", "true");
    const cat = chip.dataset.filter;
    tiles.forEach(t => {
      const show = cat === "all" || t.dataset.cat === cat;
      t.classList.toggle("hide", !show);
    });
  }));

  /* booking request form — sample form: validates, submits nowhere */
  const form = document.getElementById("book-form");
  if (form) {
    const success = document.getElementById("form-success");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      const need = ["f-name", "f-contact", "f-service"];
      need.forEach(id => {
        const input = document.getElementById(id);
        const field = input.closest(".field");
        const empty = !input.value.trim();
        field.classList.toggle("invalid", empty);
        input.setAttribute("aria-invalid", empty ? "true" : "false");
        if (empty) ok = false;
      });
      const consent = document.getElementById("f-consent");
      const consentField = consent.closest(".consent");
      if (!consent.checked) {
        ok = false;
        consentField.style.outline = "2px solid #9C3A1B";
        consentField.style.borderRadius = "8px";
      } else {
        consentField.style.outline = "";
      }
      if (ok) {
        form.style.display = "none";
        success.classList.add("show");
        success.focus();
      }
    });
    // clear error state as the visitor types
    form.querySelectorAll("input,select,textarea").forEach(el =>
      el.addEventListener("input", () =>
        el.closest(".field") && el.closest(".field").classList.remove("invalid")));
  }
});
