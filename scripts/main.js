(function () {
  const data = window.presentationData;
  const nav = document.querySelector("#top-nav");
  const slides = document.querySelector("#slides");

  if (!data || !nav || !slides) {
    return;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === "string") node.textContent = text;
    return node;
  }

  function buildSlide(id) {
    const section = el("section", "slide");
    section.id = id;
    const frame = el("div", "slide-frame");
    section.append(frame);
    return { section, frame };
  }

  function addNav() {
    data.audienceSections.forEach((item) => {
      const link = el("a", "", item.label);
      link.href = `#${item.id}`;
      nav.append(link);
    });
  }

  function buildScreenshotPanel(item) {
    const wrap = el("article", "case-screen");
    wrap.append(el("p", "result-badge", "결과물"), el("h3", "case-title", "결과 화면"));

    if (item.screenshotUrl) {
      const imageFrame = el("div", "screen-frame");
      const image = document.createElement("img");
      image.className = "screen-image";
      image.src = item.screenshotUrl;
      image.alt = item.screenshotAlt || `${item.title} 캡처`;
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
    const revisionBadge = el("span", "revision-badge", "수정 프롬프트 1");
    const revisionHint = el("span", "revision-hint", "클릭해서 다음 수정 보기");
    revisionTop.append(revisionBadge, revisionHint);

    const revisionText = el("p", "revision-text", item.revisions[0] || "수정 프롬프트 없음");
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
      revisionBadge.textContent = `수정 프롬프트 ${revisionIndex + 1}`;
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
      el("p", "eyebrow", "Vibe Coding Talk"),
      el("h1", "hero-title", data.hero.title),
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
      el("h2", "slide-title", "한마디로 시작해도 된다"),
      el("p", "slide-lead", "중요한 것은 첫 문장보다, 결과를 보고 계속 수정하는 대화 흐름입니다.")
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
      el("h2", "slide-title", "실시간으로는 하나만 짧게 보여준다"),
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
      el("h2", "slide-title", "프로토타입은 강하지만, 제품 개발과는 다르다"),
      el("p", "slide-lead", "발표에서는 장점만이 아니라 어디서부터 사람이 꼭 개입해야 하는지도 같이 말합니다.")
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

  function renderBoard() {
    const { section, frame } = buildSlide("board");
    frame.append(
      el("p", "eyebrow", "Live Q&A"),
      el("h2", "slide-title", "질문은 게시판으로 받고, 마지막에 답한다"),
      el("p", "slide-lead", data.board.lead)
    );

    const layout = el("div", "board-layout");
    const left = el("article", "board-card");
    left.append(el("strong", "", data.board.title), el("span", "", data.board.description));
    const steps = el("div", "board-steps");
    data.board.steps.forEach((item) => {
      steps.append(el("div", "board-step", item));
    });
    left.append(steps);

    const right = el("div", "qr-box");
    const qr = el("div", "qr-placeholder");
    qr.append(el("span", "", "QR"));
    right.append(
      el("p", "qr-badge", "질문 링크 자리"),
      qr,
      el("h3", "", "휴대폰으로 질문 남기기"),
      el("p", "", data.board.qrNote)
    );

    layout.append(left, right);
    frame.append(layout);
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
  renderBoard();
  renderClosing();
})();
