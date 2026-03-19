window.presentationData = {
  audienceSections: [
    { id: "intro", label: "시작" },
    { id: "flow", label: "흐름" },
    { id: "case-1", label: "사례 1" },
    { id: "case-2", label: "사례 2" },
    { id: "case-3", label: "사례 3" },
    { id: "demo", label: "시연" },
    { id: "limits", label: "한계" },
    { id: "board", label: "질문" },
    { id: "closing", label: "마무리" },
  ],
  hero: {
    title: "프롬프트는 짧게 시작해도 된다",
    description:
      "중요한 것은 긴 설명이 아니라, 결과를 빨리 보고 수정 지시를 반복하는 방식입니다.",
    note: "짧게 시작하고, 빨리 보고, 계속 고친다",
    stack: [
      {
        title: "비개발자도 바로 시작",
        description: "처음부터 완벽하게 쓰지 않아도 된다.",
      },
      {
        title: "결과물이 빨리 나온다",
        description: "HTML, 문서, 스크립트를 바로 확인할 수 있다.",
      },
      {
        title: "수정할수록 좋아진다",
        description: "\"이거 수정해줘\" 단계에서 완성도가 올라간다.",
      },
    ],
  },
  flow: [
    { title: "짧게 시작", description: "목표만 한 줄로 던진다." },
    { title: "AI가 초안 생성", description: "필요한 구조와 결과물을 먼저 만든다." },
    { title: "결과 확인", description: "눈으로 보고 쓸 수 있는지 판단한다." },
    { title: "수정 지시", description: "부족한 점만 짚어 다시 고친다." },
    { title: "실무 적용", description: "설명, 공유, 자동화에 바로 사용한다." },
  ],
  audienceCases: [
    {
      id: "case-1",
      kind: "보여주기용 HTML",
      title: "인터뷰 연습 페이지",
      summary: "질문과 모범답안을 바로 연습할 수 있는 링크형 페이지",
      firstPrompt:
        "스캔한 pdf에서 회사 공통 + 수학 관련된 것만 모아서 문제 + 모범답안 연습하는 html 페이지를 만들어 줘.",
      revisions: [
        "질문을 인터뷰 연습답게 다시 정리해줘.",
        "모범답안은 눌렀을 때 열리게 해줘.",
        "모바일에서도 연습하기 쉽게 버튼 간격을 넓혀줘.",
      ],
      result: "면접 대비 자료를 파일 대신 링크 하나로 공유",
      expansion: "회사 공통 질문과 수학 편집 업무 질문을 한 화면에서 보여줄 수 있다.",
      href: "https://kimbbab.github.io/temp/interview.html",
      linkLabel: "실제 페이지 보기",
      screenshotUrl:
        "https://image.thum.io/get/width/1400/crop/900/noanimate/https://kimbbab.github.io/temp/interview.html",
      screenshotAlt: "인터뷰 연습 페이지 캡처",
    },
    {
      id: "case-2",
      kind: "보여주기용 HTML",
      title: "회식 룰렛",
      summary: "짧은 프롬프트에서 공유 기능까지 붙여간 사례",
      firstPrompt: "음식점 룰렛 만들어 줘.",
      revisions: [
        "네이버 지도 정보도 함께 보이게 해줘.",
        "카카오톡으로 공유하기 버튼도 넣어줘.",
        "룰렛 화면과 식당 표를 같이 보여줘.",
      ],
      result: "재미 요소와 링크 공유를 함께 보여주는 결과물",
      expansion: "처음에는 간단한 룰렛이었지만, 수정 지시를 거치며 공유 도구로 커졌다.",
      href: "https://kimbbab.github.io/temp/meat.html",
      linkLabel: "실제 페이지 보기",
      screenshotUrl:
        "https://image.thum.io/get/width/1400/crop/900/noanimate/https://kimbbab.github.io/temp/meat.html",
      screenshotAlt: "회식 룰렛 페이지 캡처",
    },
    {
      id: "case-3",
      kind: "기획 전달용 HTML",
      title: "디지털교과서 게임 기획 시안",
      summary: "말로 설명하기 어려운 기획을 동작 예시 화면으로 보여준 사례",
      firstPrompt: "디지털교과서 게임 기획안이 이해되게, 구동 예시 html을 만들어 줘.",
      revisions: [
        "말로 설명이 안 되는 동작을 화면으로 보여줘.",
        "기획서에서 중요한 흐름만 남겨 더 직관적으로 정리해줘.",
        "회의에서 바로 보여줄 수 있게 화면 전환을 단순화해줘.",
      ],
      result: "기획 의도를 문서보다 빠르게 전달",
      expansion: "정식 개발 전, 어떻게 동작해야 하는지 같은 그림을 보는 데 큰 도움이 됐다.",
      mockScreen: {
        title: "디지털교과서 게임 예시 화면",
        lines: [
          "단원 선택 -> 미션 시작 -> 즉시 피드백",
          "학생이 눌렀을 때 어떻게 반응하는지 화면으로 설명",
          "기획안과 동작 예시를 함께 보여주는 구조",
        ],
      },
    },
  ],
  demo: {
    lead: "실시간 시연은 화면에서 바로 이해되는 HTML 도구 하나만 짧게 보여주는 편이 가장 안정적입니다.",
    main: {
      title: "수학 편집 업무용 미니 HTML 도구",
      description: "ChatGPT에서 짧은 프롬프트로 시작해 1회 수정까지 보여준다.",
      steps: ["프롬프트 입력", "초안 결과 확인", "한 번 수정 지시", "완성 화면 확인"],
    },
    support: [
      {
        title: "보조 예시 1",
        description: "회식 룰렛: 가볍고 직관적이라 분위기 전환에 좋다.",
      },
      {
        title: "보조 예시 2",
        description: "PPT->PDF: 화면보다 실무 효율 메시지가 강한 사례다.",
      },
    ],
  },
  limits: [
    {
      title: "검수는 반드시 필요",
      description: "AI 결과물은 사람이 최종 확인해야 한다.",
    },
    {
      title: "수식과 파일 변환은 예외가 많음",
      description: "특히 HWP와 수학 수식은 사람 검수가 중요하다.",
    },
    {
      title: "서비스 운영은 별도 설계가 필요",
      description: "보안, 권한, 저장은 따로 생각해야 한다.",
    },
    {
      title: "프로토타입과 제품은 다름",
      description: "기획 검증은 좋지만, 제품 개발은 개발자 협업이 필요하다.",
    },
    {
      title: "완성도는 수정 대화가 좌우",
      description: "짧게 시작해도, 잘 고쳐 나가야 결과가 좋아진다.",
    },
  ],
  board: {
    lead: "발표 중 질문을 받고, 마지막에 질문 목록을 보며 답변합니다.",
    title: "질문 운영 방식",
    description: "청중은 휴대폰으로 질문을 올리고, 발표자는 마지막에 질문을 모아 답합니다.",
    steps: ["질문 게시판 접속", "닉네임과 질문 입력", "질문 목록 누적", "발표 마지막에 질문 답변"],
    qrNote: "여기에 실제 질문 게시판 링크 또는 QR을 넣으면 됩니다.",
  },
  closing: {
    title: "바이브코딩은 실무를 빠르게 움직이게 한다",
    description:
      "긴 설명보다 빠른 초안과 반복 수정이 강점이다. 특히 비개발자의 시안 제작, 설명, 반복 업무 자동화에 잘 맞는다.",
    points: [
      "짧게 시작해도 된다",
      "결과를 빨리 보는 것이 중요하다",
      "수정 지시가 완성도를 만든다",
      "검수와 협업은 끝까지 필요하다",
    ],
  },
};
