(function () {
  const data = window.presentationData;
  const nav = document.querySelector("#top-nav");
  const slidesRoot = document.querySelector("#slides");
  const prevButton = document.querySelector("#prev-slide");
  const nextButton = document.querySelector("#next-slide");
  const counter = document.querySelector("#slide-counter");
  const chatFrame = document.querySelector("#chat-frame");

  if (!data || !nav || !slidesRoot || !prevButton || !nextButton || !counter || !chatFrame) {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const isPresenter = query.get("mode") === "presenter";
  chatFrame.src = isPresenter
    ? "./qna/index.html?mode=presenter&embed=1"
    : "./qna/index.html?embed=1";

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof text === "string") {
      node.textContent = text;
    }
    return node;
  }

  function renderNav() {
    data.slides.forEach((item, index) => {
      const button = el("button", "nav-pill", item.label);
      button.type = "button";
      button.dataset.index = String(index);
      nav.append(button);
    });
  }

  function buildSlide(item) {
    const section = el("section", `slide slide-${item.type}`);
    section.id = item.id;
    section.hidden = true;

    const frame = el("div", "slide-frame");
    section.append(frame);

    if (item.type === "hero") {
      frame.append(el("h1", "hero-title", item.title));
      return section;
    }

    if (item.type === "process") {
      frame.append(el("h2", "slide-title", item.title));

      const lead = el("div", "process-copy");
      item.description.forEach((line) => {
        lead.append(el("p", "slide-copy", line));
      });
      frame.append(lead);

      const stepGrid = el("div", "step-grid");
      item.steps.forEach((step) => {
        stepGrid.append(el("div", "step-card", step));
      });
      frame.append(stepGrid);
      return section;
    }

    if (item.type === "case") {
      frame.append(el("h2", "slide-title", item.title));
      frame.append(el("p", "slide-copy muted", item.ai));

      const layout = el("div", "case-layout");

      const promptCard = el("article", "info-card prompt-card");
      promptCard.append(el("p", "card-label", "첫 프롬프트"));
      const promptBox = el("div", "prompt-box");
      item.prompt.forEach((line) => {
        promptBox.append(el("p", "", line));
      });
      promptCard.append(promptBox);

      const revisionCard = el("article", "info-card");
      revisionCard.append(el("p", "card-label", "수정 지시"));
      const revisionList = el("div", "revision-list");
      item.revisions.forEach((line) => {
        revisionList.append(el("div", "revision-item", line));
      });
      revisionCard.append(revisionList);

      layout.append(promptCard, revisionCard);
      frame.append(layout);
      return section;
    }

    if (item.type === "summary") {
      frame.append(el("h2", "slide-title", item.title));
      const points = el("div", "summary-grid");
      item.points.forEach((line) => {
        points.append(el("div", "summary-card", line));
      });
      frame.append(points);
      return section;
    }

    if (item.type === "video") {
      frame.append(el("h2", "slide-title", item.title));
      const videoBox = el("div", "video-placeholder");
      videoBox.append(el("span", "", item.note));
      frame.append(videoBox);
      return section;
    }

    return section;
  }

  function renderSlides() {
    data.slides.forEach((item) => {
      slidesRoot.append(buildSlide(item));
    });
  }

  renderNav();
  renderSlides();

  const slideList = Array.from(slidesRoot.querySelectorAll(".slide"));
  const navButtons = Array.from(nav.querySelectorAll(".nav-pill"));
  let activeIndex = 0;

  function syncStage(index, updateHash) {
    if (!slideList.length) {
      return;
    }

    activeIndex = Math.max(0, Math.min(index, slideList.length - 1));

    slideList.forEach((slide, current) => {
      const isActive = current === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
    });

    navButtons.forEach((button, current) => {
      button.classList.toggle("is-active", current === activeIndex);
    });

    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === slideList.length - 1;
    counter.textContent = `${activeIndex + 1} / ${slideList.length}`;

    if (updateHash) {
      history.replaceState(null, "", `#${slideList[activeIndex].id}`);
    }
  }

  function jumpByHash() {
    const hash = window.location.hash.replace("#", "");
    const index = slideList.findIndex((slide) => slide.id === hash);
    syncStage(index >= 0 ? index : 0, false);
  }

  nav.addEventListener("click", (event) => {
    const button = event.target.closest(".nav-pill");
    if (!button) {
      return;
    }

    syncStage(Number(button.dataset.index || 0), true);
  });

  prevButton.addEventListener("click", () => {
    syncStage(activeIndex - 1, true);
  });

  nextButton.addEventListener("click", () => {
    syncStage(activeIndex + 1, true);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      syncStage(activeIndex - 1, true);
    }
    if (event.key === "ArrowRight") {
      syncStage(activeIndex + 1, true);
    }
  });

  window.addEventListener("hashchange", jumpByHash);
  jumpByHash();
})();
