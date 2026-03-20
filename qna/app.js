(function () {
  const form = document.querySelector("#question-form");
  const contentInput = document.querySelector("#content");
  const message = document.querySelector("#form-message");
  const list = document.querySelector("#question-list");
  const modeToggle = document.querySelector("#mode-toggle");
  const backLink = document.querySelector("#back-link");
  const toolbar = document.querySelector("#chat-toolbar");

  if (!form || !contentInput || !message || !list || !modeToggle || !backLink || !toolbar) {
    return;
  }

  const query = new URLSearchParams(window.location.search);
  const isPresenter = query.get("mode") === "presenter";
  const isEmbed = query.get("embed") === "1";

  document.body.classList.toggle("presenter-mode", isPresenter);
  document.body.classList.toggle("embed-mode", isEmbed);

  const localStorageKey = "vive-live-chat";
  const aliasStorageKey = "vive-live-chat-alias";
  const config = window.QNA_SUPABASE_CONFIG || {};
  const hasSupabase =
    typeof window.supabase !== "undefined" &&
    Boolean(config.url) &&
    Boolean(config.anonKey);

  const client = hasSupabase
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  let refreshTimer = null;
  let lastMessageId = "";

  modeToggle.textContent = isPresenter ? "채팅" : "준비자료";

  if (isEmbed) {
    toolbar.hidden = true;
  } else if (isPresenter) {
    backLink.href = "../?mode=presenter";
  }

  modeToggle.addEventListener("click", () => {
    const target = isPresenter
      ? isEmbed
        ? "./index.html?embed=1"
        : "./index.html"
      : isEmbed
        ? "./index.html?mode=presenter&embed=1"
        : "./index.html?mode=presenter";
    window.location.href = target;
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = contentInput.value.trim();

    if (!content) {
      return;
    }

    message.textContent = "";

    const entry = buildEntry(getAlias(), content);

    try {
      await saveEntry(entry);
      form.reset();
      await loadMessages(true);
      contentInput.focus();
    } catch (error) {
      message.textContent = "전송 실패";
    }
  });

  contentInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  if (!client) {
    window.addEventListener("storage", (event) => {
      if (event.key === localStorageKey) {
        loadMessages(false).catch(handleLoadError);
      }
    });
  }

  refreshTimer = window.setInterval(() => {
    loadMessages(false).catch(handleLoadError);
  }, 4000);

  window.addEventListener("beforeunload", () => {
    if (refreshTimer) {
      window.clearInterval(refreshTimer);
    }
  });

  function getAlias() {
    const saved = localStorage.getItem(aliasStorageKey);
    if (saved) {
      return saved;
    }

    const alias = `참여자 ${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(aliasStorageKey, alias);
    return alias;
  }

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
        : "발표 후 답변 포인트를 정리하면 됩니다.",
      speaker_note: seed
        ? seed.speakerNote
        : "필요하면 발표자 메모를 추가하세요.",
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
    current.push(entry);
    localStorage.setItem(localStorageKey, JSON.stringify(current));
  }

  async function loadMessages(forceScroll) {
    const entries = client ? await loadSupabaseEntries() : readLocal();
    const sorted = entries.slice().sort((a, b) => {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    renderEntries(sorted, forceScroll);
  }

  async function loadSupabaseEntries() {
    const { data, error } = await client
      .from(config.table || "questions")
      .select("*")
      .order("created_at", { ascending: true });

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

  function renderEntries(entries, forceScroll) {
    const shouldStickToBottom = forceScroll || isNearBottom();
    list.innerHTML = "";

    if (!entries.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = isPresenter ? "아직 채팅이 없습니다." : "첫 채팅을 입력하세요.";
      list.append(empty);
      lastMessageId = "";
      return;
    }

    entries.forEach((item) => {
      const card = document.createElement("article");
      card.className = `chat-card${isPresenter ? " presenter-card" : ""}`;

      const meta = document.createElement("div");
      meta.className = "chat-meta";
      meta.textContent = `${item.author || "참여자"} · ${formatDate(item.created_at)}`;

      const chatMessage = document.createElement("div");
      chatMessage.className = "chat-message";
      chatMessage.textContent = item.content;

      card.append(meta, chatMessage);

      if (isPresenter) {
        const presenterWrap = document.createElement("div");
        presenterWrap.className = "presenter-only";
        presenterWrap.append(
          buildAnswerRow("예상 답변", item.model_answer),
          buildAnswerRow("발표자 메모", item.speaker_note)
        );
        card.append(presenterWrap);
      }

      list.append(card);
    });

    const newest = entries[entries.length - 1];
    if (newest) {
      lastMessageId = newest.id;
    }

    if (shouldStickToBottom) {
      requestAnimationFrame(() => {
        list.scrollTop = list.scrollHeight;
      });
    }
  }

  function buildAnswerRow(label, text) {
    const row = document.createElement("div");
    row.className = "answer-row";

    const labelTag = document.createElement("span");
    labelTag.className = "answer-label";
    labelTag.textContent = label;

    const content = document.createElement("p");
    content.textContent = text || "-";

    row.append(labelTag, content);
    return row;
  }

  function isNearBottom() {
    const remaining = list.scrollHeight - list.scrollTop - list.clientHeight;
    return remaining < 80;
  }

  function formatDate(value) {
    try {
      return new Intl.DateTimeFormat("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value));
    } catch (error) {
      return value;
    }
  }

  function handleLoadError() {
    message.textContent = "불러오기 실패";
  }

  loadMessages(true).catch(handleLoadError);
})();
