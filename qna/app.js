(function () {
  const form = document.querySelector("#question-form");
  const authorInput = document.querySelector("#author");
  const contentInput = document.querySelector("#content");
  const message = document.querySelector("#form-message");
  const list = document.querySelector("#question-list");
  const refreshButton = document.querySelector("#refresh-button");
  const modeToggle = document.querySelector("#mode-toggle");
  const storageBadge = document.querySelector("#storage-badge");
  const pageEyebrow = document.querySelector("#page-eyebrow");
  const pageTitle = document.querySelector("#page-title");
  const pageCopy = document.querySelector("#page-copy");
  const backLink = document.querySelector("#back-link");
  const composerTitle = document.querySelector("#composer-title");
  const listTitle = document.querySelector("#list-title");
  const contentLabel = document.querySelector("#content-label");

  if (
    !form ||
    !authorInput ||
    !contentInput ||
    !message ||
    !list ||
    !refreshButton ||
    !modeToggle ||
    !storageBadge
  ) {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const isPresenter = query.get("mode") === "presenter";
  const isEmbed = query.get("embed") === "1";

  document.body.classList.toggle("presenter-mode", isPresenter);
  document.body.classList.toggle("embed-mode", isEmbed);

  const localStorageKey = "vive-live-chat";
  const config = window.QNA_SUPABASE_CONFIG || {};
  const hasSupabase =
    typeof window.supabase !== "undefined" &&
    Boolean(config.url) &&
    Boolean(config.anonKey);

  const client = hasSupabase
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  let refreshTimer = null;

  storageBadge.textContent = hasSupabase ? "Supabase mode" : "Local mode";

  if (isPresenter) {
    pageEyebrow.textContent = "Presenter Prep";
    pageTitle.textContent = "발표자 준비자료";
    pageCopy.textContent =
      "참여자 채팅을 보면서 메모와 예상 답변까지 같이 확인하는 발표자용 화면입니다.";
    composerTitle.textContent = "메시지 직접 추가";
    listTitle.textContent = "참여자 메시지와 준비 메모";
    contentLabel.textContent = "메시지 또는 예상 질문";
    modeToggle.textContent = "참여자 채팅 보기";
  } else {
    pageEyebrow.textContent = "Live Chat";
    pageTitle.textContent = "실시간 채팅";
    pageCopy.textContent =
      "참여자는 여기에서 질문이나 반응을 남기면 됩니다. 발표자는 별도의 준비자료 모드에서 메모를 볼 수 있습니다.";
    composerTitle.textContent = "메시지 남기기";
    listTitle.textContent = "채팅 목록";
    contentLabel.textContent = "메시지";
    modeToggle.textContent = "발표자 준비자료 보기";
  }

  if (isEmbed && backLink) {
    backLink.hidden = true;
  }

  modeToggle.addEventListener("click", () => {
    const target = isPresenter
      ? isEmbed
        ? "./?embed=1"
        : "./"
      : isEmbed
        ? "./?mode=presenter&embed=1"
        : "./?mode=presenter";
    window.location.href = target;
  });

  if (backLink && isPresenter && !isEmbed) {
    backLink.href = "../?mode=presenter";
  }

  refreshButton.addEventListener("click", () => {
    loadMessages().catch(handleLoadError);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const author = authorInput.value.trim() || "익명";
    const content = contentInput.value.trim();

    if (!content) {
      message.textContent = "메시지를 입력해 주세요.";
      return;
    }

    message.textContent = "전송 중...";

    const entry = buildEntry(author, content);

    try {
      await saveEntry(entry);
      form.reset();
      message.textContent = "메시지를 전송했습니다.";
      await loadMessages();
    } catch (error) {
      message.textContent = "메시지 전송 중 오류가 발생했습니다.";
    }
  });

  if (!client) {
    window.addEventListener("storage", (event) => {
      if (event.key === localStorageKey) {
        loadMessages().catch(handleLoadError);
      }
    });
  }

  refreshTimer = window.setInterval(() => {
    loadMessages().catch(handleLoadError);
  }, 4000);

  window.addEventListener("beforeunload", () => {
    if (refreshTimer) {
      window.clearInterval(refreshTimer);
    }
  });

  function buildEntry(author, content) {
    const seed = (window.seedAnswers || []).find((item) =>
      content.includes(item.contentIncludes)
    );

    return {
      id: createId(),
      author,
      content,
      created_at: new Date().toISOString(),
      status: seed ? "ready" : "received",
      model_answer: seed
        ? seed.modelAnswer
        : "발표가 끝난 뒤 답변 포인트를 정리하면 됩니다.",
      speaker_note: seed
        ? seed.speakerNote
        : "발표자 메모가 필요하면 이 메시지를 기준으로 정리하세요.",
    };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function saveEntry(entry) {
    if (client) {
      const { error } = await client.from(config.table || "questions").insert(entry);
      if (error) {
        throw error;
      }
      return;
    }

    const current = readLocal();
    current.unshift(entry);
    localStorage.setItem(localStorageKey, JSON.stringify(current));
  }

  async function loadMessages() {
    const entries = client ? await loadSupabaseEntries() : readLocal();
    renderEntries(entries);
  }

  async function loadSupabaseEntries() {
    const { data, error } = await client
      .from(config.table || "questions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  function readLocal() {
    const raw = localStorage.getItem(localStorageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw);
    } catch (error) {
      return [];
    }
  }

  function renderEntries(entries) {
    list.innerHTML = "";

    if (!entries.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = isPresenter
        ? "아직 들어온 메시지가 없습니다. 발표 중 채팅이 쌓이면 여기에서 준비 메모와 함께 확인할 수 있습니다."
        : "아직 채팅이 없습니다. 첫 메시지를 남겨 주세요.";
      list.append(empty);
      return;
    }

    entries.forEach((item) => {
      const card = document.createElement("article");
      card.className = `question-card${isPresenter ? "" : " chat-item"}`;

      if (isPresenter) {
        const header = document.createElement("header");
        const titleWrap = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = item.content;

        const meta = document.createElement("p");
        meta.className = "meta-text";
        meta.textContent = `${item.author || "익명"} · ${formatDate(item.created_at)}`;
        titleWrap.append(title, meta);

        const status = document.createElement("span");
        status.className = "status-pill";
        status.dataset.status = item.status || "received";
        status.textContent = translateStatus(item.status);
        header.append(titleWrap, status);

        const presenterWrap = document.createElement("div");
        presenterWrap.className = "presenter-only";
        presenterWrap.append(
          buildAnswerRow("예상 답변", item.model_answer),
          buildAnswerRow("발표자 메모", item.speaker_note)
        );

        card.append(header, presenterWrap);
      } else {
        const meta = document.createElement("p");
        meta.className = "meta-text";
        meta.textContent = `${item.author || "익명"} · ${formatDate(item.created_at)}`;

        const chatMessage = document.createElement("div");
        chatMessage.className = "chat-message";
        chatMessage.textContent = item.content;

        card.append(meta, chatMessage);
      }

      list.append(card);
    });
  }

  function buildAnswerRow(label, text) {
    const row = document.createElement("div");
    row.className = "answer-row";

    const labelTag = document.createElement("span");
    labelTag.className = "question-meta";
    labelTag.textContent = label;

    const content = document.createElement("p");
    content.textContent = text || "-";

    row.append(labelTag, content);
    return row;
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function translateStatus(status) {
    if (status === "ready") {
      return "메모 준비됨";
    }
    if (status === "answered") {
      return "답변 완료";
    }
    return "수신됨";
  }

  function handleLoadError() {
    message.textContent = "목록을 불러오지 못했습니다.";
  }

  loadMessages().catch(handleLoadError);
})();
