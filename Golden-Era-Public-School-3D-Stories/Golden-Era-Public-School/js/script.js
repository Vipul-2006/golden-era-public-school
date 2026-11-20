const toggle = document.querySelector(".menu-toggle");
const navEl = document.querySelector(".main-nav");
if (toggle && navEl) {
  toggle.addEventListener("click", () => {
    const open = navEl.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    toggle.textContent = open ? "✕" : "☰";
  });
  navEl.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    navEl.classList.remove("open"); toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation"); toggle.textContent = "☰";
  }));
}
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Send admission enquiries directly to the school's confirmed WhatsApp number.
const form = document.getElementById("enquiryForm");
if (form) form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Admission Enquiry - The Golden Era Public School",
    `Parent / Guardian: ${data.get("parent")}`,
    `Phone: ${data.get("phone")}`,
    `Student: ${data.get("student")}`,
    `Class: ${data.get("class")}`,
    `Message: ${data.get("message") || "Not provided"}`
  ].join("\n");
  const url = `https://wa.me/918168145079?text=${encodeURIComponent(message)}`;
  const status = document.getElementById("formStatus");
  status.textContent = "WhatsApp is opening with your enquiry. Press Send in WhatsApp to deliver it to the school.";
  window.open(url, "_blank", "noopener,noreferrer");
});

// Interactive gallery: each photo opens its own story panel.
const galleryLinks = document.querySelectorAll(".gallery-tile");
if (galleryLinks.length) {
  const box = document.createElement("div");
  box.className = "gallery-lightbox story-modal";
  box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Photo story");
  box.innerHTML = `<div class="story-panel"><button class="lightbox-close" aria-label="Close photo story">&times;</button><div class="story-image-wrap"><img alt=""></div><div class="story-copy"><span class="section-kicker">A MOMENT AT GOLDEN ERA</span><h2></h2><p></p><div class="story-foot">Learn · Lead · Shine</div></div></div>`;
  document.body.appendChild(box);
  const photo = box.querySelector("img"), title = box.querySelector("h2"), info = box.querySelector("p");
  const close = () => { box.classList.remove("open"); document.body.classList.remove("modal-open"); };
  galleryLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      photo.src = link.href; photo.alt = link.querySelector("img")?.alt || "School gallery photo";
      title.textContent = link.dataset.title || link.querySelector("span")?.textContent || "School moment";
      info.textContent = link.dataset.info || "Explore this moment from school life.";
      box.classList.add("open"); document.body.classList.add("modal-open");
      box.querySelector("button").focus();
    });
    // Subtle pointer-based 3D tilt on desktop; cards remain flat on touch devices.
    link.addEventListener("pointermove", event => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const r = link.getBoundingClientRect();
      const x = (event.clientX - r.left) / r.width - .5;
      const y = (event.clientY - r.top) / r.height - .5;
      link.style.setProperty("--tilt-x", `${-y * 7}deg`);
      link.style.setProperty("--tilt-y", `${x * 8}deg`);
    });
    link.addEventListener("pointerleave", () => { link.style.setProperty("--tilt-x", "0deg"); link.style.setProperty("--tilt-y", "0deg"); });
  });
  box.querySelector("button").addEventListener("click", close);
  box.addEventListener("click", event => { if (event.target === box) close(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") close(); });
}

// Reveal content gently as it enters the viewport.
const revealTargets = document.querySelectorAll("main > section:not(.hero), .welcome-photo, .welcome-copy, .learning-card, .facility-row, .gallery-tile, .contact-detail");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((el, index) => { el.classList.add("reveal"); if (el.classList.contains("learning-card") || el.classList.contains("gallery-tile")) el.style.transitionDelay = `${(index % 4) * 70}ms`; });
  const observer = new IntersectionObserver((entries, obs) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); } }), { threshold: 0.12 });
  revealTargets.forEach(el => observer.observe(el));
}
