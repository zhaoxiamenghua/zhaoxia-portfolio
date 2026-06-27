(() => {
  const mediaItems = Array.from(document.querySelectorAll(".evidence-media")).filter((item) =>
    item.querySelector("img"),
  );

  if (!mediaItems.length) {
    return;
  }

  const lightbox = document.createElement("div");
  lightbox.className = "image-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "证据图片全图");
  lightbox.innerHTML = `
    <button class="image-lightbox__close" type="button" aria-label="关闭全图">×</button>
    <div class="image-lightbox__stage">
      <img alt="" />
    </div>
    <p class="image-lightbox__caption"></p>
  `;
  document.body.appendChild(lightbox);

  const closeButton = lightbox.querySelector(".image-lightbox__close");
  const fullImage = lightbox.querySelector("img");
  const caption = lightbox.querySelector(".image-lightbox__caption");
  let previousFocus = null;

  const textFor = (media, img) => {
    const figcaption = media.querySelector("figcaption");
    return (figcaption?.textContent || img.alt || "证据图片").trim();
  };

  const openLightbox = (media) => {
    const img = media.querySelector("img");
    if (!img) {
      return;
    }

    previousFocus = document.activeElement;
    fullImage.src = img.currentSrc || img.src;
    fullImage.alt = img.alt || "证据图片全图";

    const captionText = textFor(media, img);
    caption.textContent = captionText;
    caption.hidden = !captionText;

    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    fullImage.removeAttribute("src");

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus({ preventScroll: true });
    }
  };

  mediaItems.forEach((media) => {
    const img = media.querySelector("img");
    const label = textFor(media, img);
    media.tabIndex = 0;
    media.setAttribute("role", "button");
    media.setAttribute("aria-label", `${label}，查看全图`);
    media.title = "点击查看全图";

    media.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) {
        return;
      }
      openLightbox(media);
    });

    media.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      openLightbox(media);
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.classList.contains("image-lightbox__stage")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.hidden && event.key === "Escape") {
      closeLightbox();
    }
  });
})();
