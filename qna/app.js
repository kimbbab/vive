(function () {
  const form = document.querySelector("#question-form");
  const authorInput = document.querySelector("#author");
  const contentInput = document.querySelector("#content");
  const message = document.querySelector("#form-message");
  const list = document.querySelector("#question-list");
  const refreshButton = document.querySelector("#refresh-button");
  const modeToggle = document.querySelector("#mode-toggle");
  const storageBadge = document.querySelector("#storage-badge");

  const query = new URLSearchParams(window.location.search);
  const isPresenter = query.get("mode") === "presenter";
  if (isPresenter) {
    document.body.classList.add("presenter-mode");
    modeToggle.textContent = "일반 모드 보기";
  }

  const localStorageKey = "vibe-talk-questions";
  const config = window.QNA_SUPABASE_CONFIG || {};
  const hasSupabase =
    typeof window.supabase !== "undefined" &&
    Boolean(config.url) &&
    Boolean(config.anonKey);

  const client = hasSupabase
    ? window.supabase.createClient(config.url, config.anonKey)
    : null;

  storageBadge.textContent = hasSupabase ? "Supabase mode" : "Local mode";

  modeToggle.addEventListener("click", () => {
    const target = isPresenter ? "./" : "./?mode=presenter";
    window.location.href = target;
  });

  refreshButton.addEventListener("click", loadQuestions);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const author = authorInput.value.trim() || "익명";
    const content = contentInput.value.trim();

    if (!content) {
      message.textContent = "질문 내용을 입력해 주세요.";
      return;
    }

    message.textContent = "등록 중...";

    const question = buildQuestion(author, content);
    try {
      await saveQuestion(question);
      form.reset();
      message.textContent = "질문이 등록되었습니다.";
      await loadQuestions();
    } catch (error) {
      message.textContent = "등록 중 오류가 발생했습니다.";
    }
  });

  function buildQuestion(author, content) {
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
        : "발표자가 직접 확인 후 GPT로 모범답안을 보완할 질문입니다.",
      speaker_note: seed ? seed.speakerNote : "실제 경험 한 줄을 발표 전에 추가하세요.",
    };
  }

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return `q-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  async function saveQuestion(question) {
    if (client) {
      const { error } = await client.from(config.table || "questions").insert(question);
      if (error) throw error;
      return;
    }

    const current = readLocal();
    current.unshift(question);
    localStorage.setItem(localStorageKey, JSON.stringify(current));
  }

  async function loadQuestions() {
    const questions = client ? await loadSupabaseQuestions() : readLocal();
    renderQuestions(questions);
  }

  async function loadSupabaseQuestions() {
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
    if (raw) {
      return JSON.parse(raw);
    }

    const seeds = [
      {
        id: "seed-1",
        author: "발표 준비",
        content: "왜 짧은 프롬프트가 오히려 실용적인가요?",
        created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        status: "ready",
        model_answer: "짧은 프롬프트는 시작 장벽을 낮추고, 수정 대화를 빨리 시작하게 해 줍니다.",
        speaker_note: "완성도는 첫 프롬프트보다 수정 지시 단계에서 올라간다고 말하면 됩니다.",
      },
      {
        id: "seed-2",
        author: "발표 준비",
        content: "개발자 없이도 이런 질문 게시판을 만들 수 있나요?",
        created_at: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
        status: "ready",
        model_answer: "간단한 수집 도구 수준은 가능하지만, 운영형 서비스는 개발자 협업이 필요합니다.",
        speaker_note: "이번 게시판도 최소 기능으로만 설계했고, 운영형으로 가면 권한/저장 설계가 필요하다고 덧붙이세요.",
      },
    ];
    localStorage.setItem(localStorageKey, JSON.stringify(seeds));
    return seeds;
  }

  function renderQuestions(questions) {
    list.innerHTML = "";
    if (!questions.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";
      empty.textContent = "아직 등록된 질문이 없습니다.";
      list.append(empty);
      return;
    }

    questions.forEach((item) => {
      const card = document.createElement("article");
      card.className = "question-card";

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
      status.dataset.status = item.status;
      status.textContent = translateStatus(item.status);
      header.append(titleWrap, status);

      const presenterWrap = document.createElement("div");
      presenterWrap.className = "presenter-only";
      presenterWrap.append(
        buildAnswerRow("GPT 모범답안", item.model_answer),
        buildAnswerRow("발표자 메모", item.speaker_note)
      );

      card.append(header, presenterWrap);
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
    if (status === "ready") return "답변 준비됨";
    if (status === "answered") return "현장 답변 완료";
    return "접수됨";
  }

  loadQuestions().catch(() => {
    message.textContent = "질문 목록을 불러오지 못했습니다.";
  });
})();
