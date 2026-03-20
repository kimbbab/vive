window.presentationData = {
  slides: [
    {
      id: "page-1",
      label: "1",
      type: "hero",
      title: "만들고, 보고, 수정한다.",
    },
    {
      id: "page-2",
      label: "2",
      type: "process",
      title: "짧은 지시로 시작해도 충분합니다",
      description: [
        "첫 문장을 길게 쓰는 것이 아니라, 결과를 보고 수정 지시를 반복하는 흐름입니다.",
        "계획은 AI가 해줍니다.",
      ],
      steps: [
        "1 목표를 한 문장으로 정리",
        "2 AI가 계획 세우고 초안을 생성",
        "3 결과물 확인",
        "4 수정 지시 반복",
        "5 완성",
      ],
    },
    {
      id: "page-3",
      label: "3",
      type: "case",
      title: "실제 사례(1): 국정 개발 인터뷰 연습",
      ai: "사용한 AI: gemini 2.5",
      prompt: [
        "예상 질문, 답변을 스캔한 pdf를 첨부했어.",
        "질문, 답변 연습할 수 있는 html 페이지를 만들어 줘.",
      ],
      revisions: [
        "수정지시1 : 도덕 내용은 빼고 수학과 공통 질문만 남겨줘.",
        "수정지시2 : 모바일에서 스크롤 안 생기게 해 줘.",
        "수정지시3 : 이 질문과 답변을 추가해 줘.",
      ],
    },
    {
      id: "page-4",
      label: "4",
      type: "case",
      title: "실제 사례(2): 음식점 5개 선택하는 룰렛",
      ai: "사용한 AI: gemini 3.0",
      prompt: [
        "음식점 5개 선택하는 룰렛을 만들어 줘.",
        "유일순대, 장군집, 대송참숯, 마포옥, 맛찬들",
      ],
      revisions: [
        "수정지시1 : 선택된 곳 정보랑 네이버지도 넣어줘.",
        "수정지시2 : 카카오톡 공유하기도 추가해 줘.",
      ],
    },
    {
      id: "page-5",
      label: "5",
      type: "summary",
      title: "정리",
      points: [
        "짧게 시작한다.",
        "AI가 계획한다.",
        "결과를 보고 수정한다.",
      ],
    },
    {
      id: "page-6",
      label: "6",
      type: "video",
      title: "시연",
      note: "여기에 시연 동영상을 넣을 예정입니다.",
    },
  ],
};
