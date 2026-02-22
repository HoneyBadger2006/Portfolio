// lightbox.js
(function () {
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.innerHTML = `
    <button class="lightbox__close" aria-label="Close">✕</button>
    <img class="lightbox__img" alt="" />
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox__img");
  const closeBtn = overlay.querySelector(".lightbox__close");

  function openLightbox(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt || "";
    overlay.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    overlay.classList.remove("show");
    imgEl.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest("img.zoomable");
    if (!img) return;

    // use original attribute if possible
    const src = img.getAttribute("src") || img.src;
    openLightbox(src, img.alt);
  });

  closeBtn.addEventListener("click", closeLightbox);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
})();