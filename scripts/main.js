(function () {
  const data = window.presentationData;
  const nav = document.querySelector("#top-nav");
  const slides = document.querySelector("#slides");
  const prevButton = document.querySelector("#prev-slide");
  const nextButton = document.querySelector("#next-slide");
  const counter = document.querySelector("#slide-counter");
  const chatFrame = document.querySelector("#chat-frame");
  const presenterLink = document.querySelector("#presenter-link");

  if (!data || !nav || !slides || !prevButton || !nextButton || !counter || !chatFrame) {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const isPresenter = query.get("mode") === "presenter";
  document.body.classList.toggle("presenter-mode", isPresenter);

  chatFrame.src = isPresenter
    ? "./qna/index.html?mode=presenter&embed=1"
    : "./qna/index.html?embed=1";
  if (!isPresenter && presenterLink) {
    presenterLink.hidden = true;
  }

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

  function buildSlide(id) {
    const section = el("section", "slide");
    section.id = id;
    section.hidden = true;

    const frame = el("div", "slide-frame");
    section.append(frame);
    return { section, frame };
  }

  function addNav() {
    data.audienceSections.forEach((item, index) => {
      const button = el("button", "nav-pill", item.label);
      button.type = "button";
      button.dataset.index = String(index);
      button.dataset.target = item.id;
      nav.append(button);
    });
  }

  function buildScreenshotPanel(item) {
    const wrap = el("article", "case-screen");
    wrap.append(el("p", "result-badge", "결과 화면"), el("h3", "case-title", "완성된 결과"));

    if (item.screenshotUrl) {
      const imageFrame = el("div", "screen-frame");
      const image = document.createElement("img");
      image.className = "screen-image";
      image.src = item.screenshotUrl;
      image.alt = item.screenshotAlt || `${item.title} 화면`;
      image.loading = "lazy";
      imageFrame.append(image);
      wrap.append(imageFrame);
    } else if (item.mockScreen) {
      const mock = el("div", "screen-frame mock");
      mock.append(el("strong", "mock-title", item.mockScreen.title));

      const list = el("div", "mock-lines");
      item.mockScreen.lines.forEach((line) => {
        list.append(el("div", "mock-line", line));
      });

      mock.append(list);
      wrap.append(mock);
    }

    const result = el("div", "case-result");
    result.append(el("strong", "", item.result), el("span", "", item.expansion || ""));
    wrap.append(result);

    if (item.href) {
      const link = el("a", "case-link", item.linkLabel || "결과 보기");
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noreferrer";
      wrap.append(link);
    }

    return wrap;
  }

  function buildRevisionPanel(item) {
    const panel = el("article", "case-card feature");
    panel.append(el("p", "case-kind", item.kind), el("h2", "case-title", item.title), el("p", "", item.summary));

    const firstPromptLabel = el("p", "prompt-label", "첫 프롬프트");
    const firstPrompt = el("div", "first-prompt", item.firstPrompt);
    panel.append(firstPromptLabel, firstPrompt);

    const revisionBox = el("button", "revision-box");
    revisionBox.type = "button";
    revisionBox.setAttribute("aria-live", "polite");

    const revisionTop = el("div", "revision-top");
    const revisionBadge = el("span", "revision-badge", "수정 지시 1");
    const revisionHint = el("span", "revision-hint", "클릭해서 다음 수정 보기");
    revisionTop.append(revisionBadge, revisionHint);

    const revisionText = el("p", "revision-text", item.revisions[0] || "수정 지시 없음");
    const revisionProgress = el("div", "revision-progress");

    item.revisions.forEach((_, index) => {
      const dot = el("span", index === 0 ? "revision-dot active" : "revision-dot");
      revisionProgress.append(dot);
    });

    revisionBox.append(revisionTop, revisionText, revisionProgress);
    panel.append(revisionBox);

    let revisionIndex = 0;

    revisionBox.addEventListener("click", () => {
      if (!item.revisions.length) {
        return;
      }

      revisionIndex = (revisionIndex + 1) % item.revisions.length;
      revisionBadge.textContent = `수정 지시 ${revisionIndex + 1}`;
      revisionText.textContent = item.revisions[revisionIndex];

      Array.from(revisionProgress.children).forEach((dot, index) => {
        dot.className = index === revisionIndex ? "revision-dot active" : "revision-dot";
      });
    });

    return panel;
  }

  function renderHero() {
    const { section, frame } = buildSlide("intro");
    const layout = el("div", "hero-layout");

    const left = el("div");
    left.append(
      el("p", "eyebrow", "Opening"),
      el("h2", "hero-title", data.hero.title),
      el("p", "hero-subtitle", data.hero.description),
      el("p", "hero-note", data.hero.note)
    );

    const right = el("div", "hero-stack");
    data.hero.stack.forEach((item) => {
      const card = el("article", "hero-stack-card");
      card.append(el("strong", "", item.title), el("span", "", item.description));
      right.append(card);
    });

    layout.append(left, right);
    frame.append(layout);
    slides.append(section);
  }

  function renderFlow() {
    const { section, frame } = buildSlide("flow");
    frame.append(
      el("p", "eyebrow", "How It Works"),
      el("h2", "slide-title", "짧은 지시로 시작해도 충분합니다"),
      el(
        "p",
        "slide-lead",
        "핵심은 첫 문장을 길게 쓰는 것이 아니라, 결과를 보고 수정 지시를 빠르게 반복하는 흐름입니다."
      )
    );

    const grid = el("div", "flow-grid");
    data.flow.forEach((item, index) => {
      const card = el("article", "flow-card");
      card.append(
        el("div", "flow-number", String(index + 1)),
        el("strong", "", item.title),
        el("span", "", item.description)
      );
      grid.append(card);
    });

    frame.append(grid);
    slides.append(section);
  }

  function renderCases() {
    data.audienceCases.forEach((item) => {
      const { section, frame } = buildSlide(item.id);
      frame.append(
        el("p", "eyebrow", "Real Case"),
        el("h2", "slide-title", item.title),
        el("p", "slide-lead", item.summary)
      );

      const layout = el("div", "case-slide-layout");
      layout.append(buildRevisionPanel(item), buildScreenshotPanel(item));
      frame.append(layout);
      slides.append(section);
    });
  }

  function renderDemo() {
    const { section, frame } = buildSlide("demo");
    frame.append(
      el("p", "eyebrow", "Live Demo"),
      el("h2", "slide-title", "작은 결과 하나를 만드는 과정을 보여줍니다"),
      el("p", "slide-lead", data.demo.lead)
    );

    const layout = el("div", "demo-layout");
    const main = el("article", "demo-card main");
    main.append(el("strong", "", data.demo.main.title), el("span", "", data.demo.main.description));

    const steps = el("div", "demo-steps");
    data.demo.main.steps.forEach((item) => {
      steps.append(el("div", "demo-step", item));
    });
    main.append(steps);

    const support = el("div", "support-list");
    data.demo.support.forEach((item) => {
      const card = el("article", "demo-card");
      card.append(el("strong", "", item.title), el("span", "", item.description));
      support.append(card);
    });

    layout.append(main, support);
    frame.append(layout);
    slides.append(section);
  }

  function renderLimits() {
    const { section, frame } = buildSlide("limits");
    frame.append(
      el("p", "eyebrow", "Limit"),
      el("h2", "slide-title", "프로토타입에는 강하지만 운영 설계는 별개입니다"),
      el(
        "p",
        "slide-lead",
        "발표에서는 장점만이 아니라 언제 사람의 검토와 제품 수준의 설계가 필요한지도 함께 짚어야 합니다."
      )
    );

    const grid = el("div", "limit-grid");
    data.limits.forEach((item) => {
      const card = el("article", "limit-card");
      card.append(el("strong", "", item.title), el("span", "", item.description));
      grid.append(card);
    });

    frame.append(grid);
    slides.append(section);
  }

  function renderClosing() {
    const { section, frame } = buildSlide("closing");
    const layout = el("div", "closing-layout");

    const main = el("article", "closing-card");
    main.append(
      el("p", "eyebrow", "Conclusion"),
      el("h2", "closing-main", data.closing.title),
      el("p", "closing-note", data.closing.description)
    );

    const side = el("div", "closing-points");
    data.closing.points.forEach((item) => {
      side.append(el("div", "closing-point", item));
    });

    layout.append(main, side);
    frame.append(layout);
    slides.append(section);
  }

  addNav();
  renderHero();
  renderFlow();
  renderCases();
  renderDemo();
  renderLimits();
  renderClosing();

  const slideList = Array.from(slides.querySelectorAll(".slide"));
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
      button.setAttribute("aria-current", current === activeIndex ? "true" : "false");
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

    const index = Number(button.dataset.index || 0);
    syncStage(index, true);
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
