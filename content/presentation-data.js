window.presentationData = {
  audienceSections: [
    { id: "intro", label: "시작" },
    { id: "flow", label: "흐름" },
    { id: "case-1", label: "사례 1" },
    { id: "case-2", label: "사례 2" },
    { id: "case-3", label: "사례 3" },
    { id: "demo", label: "시연" },
    { id: "limits", label: "한계" },
    { id: "closing", label: "마무리" },
  ],
  hero: {
    title: "발표는 빠르게 만들고, 설명은 결과로 한다",
    description:
      "긴 요구사항보다 먼저 결과를 만들고 계속 수정하는 방식이 이번 발표의 핵심입니다. 보여주고, 고치고, 바로 다시 쓰는 흐름을 소개합니다.",
    note: "핵심: 먼저 만들고, 보고, 바로 수정한다.",
    stack: [
      {
        title: "진입장벽이 낮다",
        description: "완성형 요구사항이 없어도 첫 화면을 바로 만들 수 있습니다.",
      },
      {
        title: "결과를 먼저 본다",
        description: "HTML, 문서, 시안을 눈으로 확인하면서 방향을 조정합니다.",
      },
      {
        title: "수정이 빨라진다",
        description: "어디를 어떻게 고칠지 말로 지시하면 다음 버전이 바로 나옵니다.",
      },
    ],
  },
  flow: [
    { title: "목표를 한 문장으로 정리", description: "무엇을 보여줄지만 짧게 적고 시작합니다." },
    { title: "AI가 초안을 생성", description: "형태와 구조를 먼저 만들어서 손에 잡히는 결과를 만듭니다." },
    { title: "결과를 보고 판단", description: "좋은 점과 어색한 점을 화면 기준으로 빠르게 찾습니다." },
    { title: "수정 지시 반복", description: "모호한 설명 대신 바꿀 부분만 정확히 짚어서 고칩니다." },
    { title: "실무에 즉시 연결", description: "공유, 설명, 검토 자료로 바로 전환할 수 있습니다." },
  ],
  audienceCases: [
    {
      id: "case-1",
      kind: "보여주기용 HTML",
      title: "면접 연습 페이지",
      summary: "예상 질문과 모범 답안을 한 화면에서 바로 연습할 수 있게 만든 사례입니다.",
      firstPrompt:
        "이력서와 채용 공고를 바탕으로 예상 질문과 모범 답안을 연습할 수 있는 단일 HTML 페이지를 만들어줘.",
      revisions: [
        "질문을 직무 역량과 협업 경험으로 나눠서 다시 정리해줘.",
        "모범 답안은 너무 길지 않게 면접 말투로 줄여줘.",
        "모바일에서도 버튼 간격이 넉넉하도록 UI를 다시 다듬어줘.",
      ],
      result: "준비자료를 링크 하나로 공유할 수 있는 연습 페이지 완성",
      expansion: "문서보다 빠르게 검토할 수 있고, 바로 보여주며 설명하기 좋았습니다.",
      href: "https://kimbbab.github.io/temp/interview.html",
      linkLabel: "예시 보기",
      screenshotUrl:
        "https://image.thum.io/get/width/1400/crop/900/noanimate/https://kimbbab.github.io/temp/interview.html",
      screenshotAlt: "면접 연습 페이지 예시",
    },
    {
      id: "case-2",
      kind: "보여주기용 HTML",
      title: "회식 룰렛",
      summary: "단순 아이디어에서 시작해 공유 가능한 미니 도구로 확장한 사례입니다.",
      firstPrompt: "회식 메뉴를 고르는 룰렛 HTML을 만들어줘.",
      revisions: [
        "회전이 끝난 뒤 당첨 결과가 더 눈에 띄게 보여야 해.",
        "카카오톡으로 바로 공유할 수 있는 버튼을 추가해줘.",
        "룰렛 화면과 결과 화면의 리듬감이 더 명확했으면 좋겠어.",
      ],
      result: "짧은 지시 몇 번으로 공유 가능한 이벤트 페이지가 완성",
      expansion: "단순 장난감 화면이 아니라 바로 사람들에게 보여줄 수 있는 결과물로 발전했습니다.",
      href: "https://kimbbab.github.io/temp/meat.html",
      linkLabel: "예시 보기",
      screenshotUrl:
        "https://image.thum.io/get/width/1400/crop/900/noanimate/https://kimbbab.github.io/temp/meat.html",
      screenshotAlt: "회식 룰렛 예시",
    },
    {
      id: "case-3",
      kind: "기획 전달용 HTML",
      title: "교과서 게임화 시안",
      summary: "문서로 설명하기 어려운 흐름을 인터랙션 시안으로 전달한 사례입니다.",
      firstPrompt:
        "초등 교과서 학습을 게임처럼 이해시키는 시안을 인터랙션이 느껴지는 HTML로 만들어줘.",
      revisions: [
        "아이의 행동 흐름이 단계별로 더 직관적으로 보이면 좋겠어.",
        "기획 포인트는 많지 않게, 핵심 단계만 크게 강조해줘.",
        "회의에서 바로 보여주기 좋게 화면 전환을 단순하게 정리해줘.",
      ],
      result: "문서보다 빠르게 의도를 전달하고 피드백을 받는 시안 완성",
      expansion: "상상해야 했던 흐름을 눈으로 볼 수 있게 만들어 논의 속도가 빨라졌습니다.",
      mockScreen: {
        title: "게임화 시안 화면 예시",
        lines: [
          "단원 선택 후 바로 미션이 시작되고 즉시 피드백이 나옵니다.",
          "학생 행동 흐름을 문장 대신 화면 구조로 설명합니다.",
          "기획 의도와 실제 사용 모습을 같은 화면에서 보여줍니다.",
        ],
      },
    },
  ],
  demo: {
    lead: "라이브에서는 결과가 바로 보이는 작은 HTML 하나를 만들고, 수정 지시가 품질을 어떻게 바꾸는지 보여줍니다.",
    main: {
      title: "미니 HTML 도구 만들기",
      description: "짧은 프롬프트에서 시작해 두세 번의 수정만으로 사용 가능한 화면까지 가는 흐름입니다.",
      steps: ["짧은 요구 입력", "초안 확인", "구체적으로 수정 지시", "완성 화면 검토"],
    },
    support: [
      {
        title: "보조 시연 1",
        description: "간단한 룰렛 화면처럼 반응이 빠른 예시가 분위기를 끌어올리기 좋습니다.",
      },
      {
        title: "보조 시연 2",
        description: "문서나 PDF를 재정리하는 예시는 실무 적용성을 설명하기 좋습니다.",
      },
    ],
  },
  limits: [
    {
      title: "검토는 반드시 필요",
      description: "생성 속도와 정확성은 다른 문제이므로 최종 확인은 사람이 맡아야 합니다.",
    },
    {
      title: "복잡한 포맷은 예외가 많음",
      description: "수식, HWP, 복잡한 규정 문서는 별도 검증이 필요합니다.",
    },
    {
      title: "서비스 운영은 별도 설계",
      description: "권한, 보안, 데이터 정책은 제품 수준의 설계가 따로 필요합니다.",
    },
    {
      title: "기획 검증과 제품 개발은 다름",
      description: "보여주기용 결과물과 실제 서비스는 요구하는 안정성이 다릅니다.",
    },
    {
      title: "품질은 수정 지시가 좌우",
      description: "첫 결과보다 수정 요청의 품질이 최종 결과에 더 큰 영향을 줍니다.",
    },
  ],
  closing: {
    title: "Vibe Coding은 시작 속도를 높이고 설명 비용을 줄인다",
    description:
      "완성된 요구사항이 없어도 초안을 만들 수 있고, 그 초안을 보며 더 정확하게 요구할 수 있습니다. 그래서 보여주기, 설명하기, 기획 검증하기에 특히 강합니다.",
    points: [
      "짧게 시작해도 된다",
      "결과를 먼저 보는 것이 중요하다",
      "수정 지시가 품질을 만든다",
      "검토와 운영 설계는 별도다",
    ],
  },
};
