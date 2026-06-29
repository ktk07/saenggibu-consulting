/** @typedef {import("./careerTypes.js").CareerInput} CareerInput */
/** @typedef {import("./careerTypes.js").CareerCandidate} CareerCandidate */

/**
 * @param {CareerInput} input
 * @returns {CareerCandidate[]}
 */
export function buildMockCareerCandidates(input) {
  const source = normalize(
    [
      input.rawCareerInput,
      ...input.interests,
      ...input.favoriteSubjects,
      ...(input.targetProblems ?? []),
      input.preference,
      input.avoidance,
    ].join(" ")
  );

  if (matches(source, ["변호", "법", "복지", "노인", "고령", "사회"])) {
    return lawCandidates(input);
  }

  if (matches(source, ["전기", "전자", "에너지", "환경", "공학", "전력"])) {
    return energyCandidates(input);
  }

  if (matches(source, ["수학", "데이터", "사회문제", "도시", "교통", "통계"])) {
    return dataEngineeringCandidates(input);
  }

  if (matches(source, ["ai", "인공지능", "의료", "생명", "정보", "헬스"])) {
    return healthcareAiCandidates(input);
  }

  return generalCandidates(input);
}

/**
 * @param {CareerInput} input
 * @param {CareerCandidate} selectedCandidate
 * @param {string} feedback
 * @returns {CareerCandidate[]}
 */
export function refineMockCareerCandidates(input, selectedCandidate, feedback) {
  const lower = normalize(feedback);
  const base = { ...selectedCandidate };

  if (matches(lower, ["구체"])) {
    return variants(base, [
      ["지역 현장의 문제를 구체적으로 해결하는", "현장 조사와 상담 기록을 바탕으로 더 선명한 문제 해결 방향을 제안했습니다."],
      ["취약 집단의 실제 불편을 좁혀 해결하는", "대상과 문제 범위를 좁혀 진로 정체성을 더 구체화했습니다."],
      ["제도와 현장을 연결해 실행안을 만드는", "관심 분야를 실제 활동으로 연결하기 쉽게 조정했습니다."],
    ]);
  }

  if (matches(lower, ["현실", "직업"])) {
    return variants(base, [
      ["현장 실무 역량으로 문제를 해결하는", "직업 현장에서 수행하는 역할을 더 또렷하게 드러냈습니다."],
      ["전문 자격과 실무 경험을 바탕으로 돕는", "실제 직무와 연결되는 표현으로 조정했습니다."],
      ["조사, 분석, 실행을 함께 수행하는", "현실적인 업무 흐름을 반영했습니다."],
    ]);
  }

  if (matches(lower, ["연구", "학문"])) {
    return variants(base, [
      ["연구 기반으로 원인을 밝히고 해법을 제안하는", "탐구와 연구 성격을 강화했습니다."],
      ["자료 분석으로 구조적 원인을 탐구하는", "학문적 문제의식이 드러나도록 조정했습니다."],
      ["이론과 데이터를 연결해 개선책을 찾는", "탐구형 진로 정체성에 맞게 바꾸었습니다."],
    ]);
  }

  if (matches(lower, ["전문", "전문직"])) {
    return variants(base, [
      ["전문 지식으로 복합 문제를 해결하는", "전문직으로 성장할 수 있는 방향을 강화했습니다."],
      ["전문 윤리와 분석력을 바탕으로 돕는", "전문성과 책임감을 함께 드러냈습니다."],
      ["분야 전문성을 살려 실질적 변화를 만드는", "직업 전문성이 보이도록 표현했습니다."],
    ]);
  }

  if (matches(lower, ["기술", "공학"])) {
    return variants(base, [
      ["기술 설계로 사회문제를 해결하는", "기술과 공학 중심성이 보이도록 조정했습니다."],
      ["공학적 도구로 접근성을 높이는", "문제 해결 도구를 공학적으로 재구성했습니다."],
      ["시스템을 설계해 불편을 줄이는", "구현 가능한 기술 진로로 다듬었습니다."],
    ]);
  }

  if (matches(lower, ["데이터", "ai"])) {
    return variants(base, [
      ["데이터와 AI로 판단 격차를 줄이는", "데이터 기반 분석과 AI 활용 방향을 강화했습니다."],
      ["예측 모델로 문제를 조기에 발견하는", "AI 도구를 활용하는 진로로 조정했습니다."],
      ["공공 데이터를 해석해 개선책을 찾는", "데이터 분석 진로로 구체화했습니다."],
    ]);
  }

  if (matches(lower, ["사회", "문제"])) {
    return variants(base, [
      ["사회문제의 원인을 분석하고 해결하는", "사회적 기여 방향을 더 앞에 두었습니다."],
      ["취약한 사람의 불편을 줄이는", "수혜자와 기여 방향을 강화했습니다."],
      ["제도와 서비스를 개선해 격차를 줄이는", "사회문제 해결형 표현으로 조정했습니다."],
    ]);
  }

  return buildMockCareerCandidates({
    ...input,
    interests: [...input.interests, feedback],
  });
}

function lawCandidates(input) {
  return [
    candidate({
      id: "career-elderly-lawyer-1",
      title: "고령사회 법률 사각지대를 해결하는 노인전문 변호사",
      job: "변호사",
      modifier: "고령사회 법률 사각지대를 해결하는",
      domain: ["법", "복지", "고령사회"],
      problem: "노인 법률 사각지대",
      beneficiary: ["노인", "독거노인", "치매 환자", "가족 돌봄자"],
      tools: ["법률 해석", "제도 분석", "상담", "통계 분석"],
      contribution: "고령자의 권익을 보호하고 법률 접근성을 높임",
      subjects: ["정치와 법", "사회문화", "확률과 통계", "국어"],
      majors: ["법학과", "사회복지학과", "행정학과"],
      reason: "법, 복지, 고령사회 문제에 대한 관심을 구체적인 법률 전문 진로로 연결할 수 있습니다.",
      score: score(input, 5),
    }),
    candidate({
      id: "career-public-law-2",
      title: "고령자의 권익 보호 제도를 연구하고 개선하는 공익법 전문가",
      job: "공익법 전문가",
      modifier: "고령자의 권익 보호 제도를 연구하고 개선하는",
      domain: ["법", "정책", "인권"],
      problem: "취약계층 권리 보호 제도의 공백",
      beneficiary: ["노인", "장애인", "저소득층"],
      tools: ["판례 분석", "정책 제안", "공공 데이터 분석"],
      contribution: "취약계층을 위한 법과 제도의 실효성을 높임",
      subjects: ["정치와 법", "사회문화", "생활과 윤리"],
      majors: ["법학과", "정책학과", "사회학과"],
      reason: "사회문제 해결 관심을 제도 개선과 공익 활동으로 확장할 수 있습니다.",
      score: score(input, 4),
    }),
    candidate({
      id: "career-welfare-policy-3",
      title: "돌봄 공백을 법과 복지 정책으로 줄이는 사회정책 연구원",
      job: "사회정책 연구원",
      modifier: "돌봄 공백을 법과 복지 정책으로 줄이는",
      domain: ["복지", "정책", "데이터"],
      problem: "지역별 돌봄 서비스 격차",
      beneficiary: ["노인", "보호자", "지역사회"],
      tools: ["설문조사", "통계 분석", "정책 평가"],
      contribution: "근거 기반 정책으로 돌봄 격차를 완화함",
      subjects: ["사회문화", "확률과 통계", "경제"],
      majors: ["사회복지학과", "행정학과", "통계학과"],
      reason: "복지 문제를 데이터와 정책 분석으로 해결하는 방향입니다.",
      score: score(input, 4),
    }),
  ];
}

function energyCandidates(input) {
  return [
    candidate({
      id: "career-power-engineer-1",
      title: "재생에너지 확대에 따른 전력망 안정성을 연구하는 전기공학자",
      job: "전기공학자",
      modifier: "재생에너지 확대에 따른 전력망 안정성을 연구하는",
      domain: ["전기", "에너지", "환경"],
      problem: "재생에너지 변동성으로 인한 전력망 불안정",
      beneficiary: ["지역사회", "전력 사용자", "에너지 기업"],
      tools: ["회로 분석", "전력 데이터", "시뮬레이션", "제어 기술"],
      contribution: "안정적인 에너지 전환과 전력 공급에 기여함",
      subjects: ["물리학", "수학", "확률과 통계", "정보"],
      majors: ["전기공학과", "에너지공학과", "전자공학과"],
      reason: "전기와 에너지 관심을 사회적 에너지 문제 해결로 연결합니다.",
      score: score(input, 5),
    }),
    candidate({
      id: "career-energy-storage-2",
      title: "전력 변동성 예측과 에너지 저장 기술을 개발하는 전기전자공학자",
      job: "전기전자공학자",
      modifier: "전력 변동성 예측과 에너지 저장 기술을 개발하는",
      domain: ["전기", "전자", "저장장치"],
      problem: "전력 수요와 공급의 불균형",
      beneficiary: ["가정", "산업체", "전력 운영기관"],
      tools: ["센서", "배터리 시스템", "예측 모델", "전력 제어"],
      contribution: "전력 사용 효율을 높이고 정전을 예방함",
      subjects: ["물리학", "미적분", "정보"],
      majors: ["전기전자공학과", "신소재공학과", "컴퓨터공학과"],
      reason: "공학적 설계와 데이터 예측을 함께 활용할 수 있습니다.",
      score: score(input, 4),
    }),
    candidate({
      id: "career-green-grid-3",
      title: "지역 에너지 데이터를 분석해 친환경 전력 시스템을 설계하는 에너지공학자",
      job: "에너지공학자",
      modifier: "지역 에너지 데이터를 분석해 친환경 전력 시스템을 설계하는",
      domain: ["에너지", "데이터", "기후"],
      problem: "지역별 에너지 효율 격차",
      beneficiary: ["지역 주민", "지자체", "환경 취약 지역"],
      tools: ["공공 데이터", "수요 예측", "전력 설계"],
      contribution: "지역 맞춤형 에너지 전환을 도움",
      subjects: ["지구과학", "수학", "정보"],
      majors: ["에너지공학과", "환경공학과", "산업공학과"],
      reason: "환경 관심과 공학적 해결책을 동시에 살릴 수 있습니다.",
      score: score(input, 4),
    }),
  ];
}

function dataEngineeringCandidates(input) {
  return [
    candidate({
      id: "career-urban-data-1",
      title: "데이터 기반으로 도시 교통 불평등을 개선하는 산업공학자",
      job: "산업공학자",
      modifier: "데이터 기반으로 도시 교통 불평등을 개선하는",
      domain: ["데이터", "도시", "교통"],
      problem: "지역별 교통 접근성 격차",
      beneficiary: ["통학생", "교통약자", "외곽 지역 주민"],
      tools: ["공공 데이터", "최적화", "통계 분석", "시각화"],
      contribution: "이동 격차를 줄이고 효율적인 도시 서비스를 설계함",
      subjects: ["확률과 통계", "수학", "정보", "사회문화"],
      majors: ["산업공학과", "도시공학과", "통계학과"],
      reason: "수학과 데이터 관심을 실제 사회문제인 교통 격차 해결로 연결합니다.",
      score: score(input, 5),
    }),
    candidate({
      id: "career-policy-data-2",
      title: "공공 데이터를 활용해 지역 격차를 분석하는 정책데이터 분석가",
      job: "정책데이터 분석가",
      modifier: "공공 데이터를 활용해 지역 격차를 분석하는",
      domain: ["데이터", "정책", "사회문제"],
      problem: "정책 지원의 지역별 불균형",
      beneficiary: ["지역 주민", "청소년", "취약계층"],
      tools: ["통계", "대시보드", "설문 분석", "GIS"],
      contribution: "정책 의사결정의 근거를 제공함",
      subjects: ["확률과 통계", "사회문화", "경제", "정보"],
      majors: ["통계학과", "행정학과", "데이터사이언스학과"],
      reason: "사회문제를 데이터로 설명하고 개선하는 진로입니다.",
      score: score(input, 4),
    }),
    candidate({
      id: "career-service-ops-3",
      title: "수요 데이터를 분석해 공공서비스 배치를 개선하는 운영관리 전문가",
      job: "운영관리 전문가",
      modifier: "수요 데이터를 분석해 공공서비스 배치를 개선하는",
      domain: ["산업공학", "공공서비스", "최적화"],
      problem: "공공서비스 자원 배치의 비효율",
      beneficiary: ["민원인", "지자체", "서비스 이용자"],
      tools: ["최적화 모델", "수요 예측", "프로세스 분석"],
      contribution: "제한된 자원을 더 필요한 곳에 배치하도록 도움",
      subjects: ["수학", "정보", "경제"],
      majors: ["산업공학과", "경영공학과", "데이터분석학과"],
      reason: "수학적 사고를 실제 시스템 개선으로 확장할 수 있습니다.",
      score: score(input, 4),
    }),
  ];
}

function healthcareAiCandidates(input) {
  return [
    candidate({
      id: "career-health-ai-1",
      title: "의료 데이터를 활용해 질병 예측 정확도를 높이는 디지털헬스 데이터 분석가",
      job: "디지털헬스 데이터 분석가",
      modifier: "의료 데이터를 활용해 질병 예측 정확도를 높이는",
      domain: ["의료", "AI", "데이터"],
      problem: "질병 조기 발견의 정보 격차",
      beneficiary: ["환자", "의료진", "지역 보건기관"],
      tools: ["머신러닝", "의료 데이터", "통계", "시각화"],
      contribution: "질병 위험을 더 빨리 발견하고 의료 접근성을 개선함",
      subjects: ["생명과학", "정보", "확률과 통계"],
      majors: ["의생명공학과", "데이터사이언스학과", "컴퓨터공학과"],
      reason: "AI와 의료 관심을 사람을 돕는 데이터 진로로 연결합니다.",
      score: score(input, 5),
    }),
    candidate({
      id: "career-care-ai-2",
      title: "AI 기반 의료 접근성 개선 기술을 개발하는 헬스케어 AI 개발자",
      job: "헬스케어 AI 개발자",
      modifier: "AI 기반 의료 접근성 개선 기술을 개발하는",
      domain: ["AI", "의료", "소프트웨어"],
      problem: "지역과 소득에 따른 의료 서비스 접근 격차",
      beneficiary: ["의료 취약지역 주민", "환자", "보건소"],
      tools: ["인공지능", "앱 개발", "데이터 모델링"],
      contribution: "더 많은 사람이 의료 정보를 쉽게 이용하도록 도움",
      subjects: ["정보", "생명과학", "수학"],
      majors: ["컴퓨터공학과", "의공학과", "인공지능학과"],
      reason: "기술 개발과 사회적 기여를 동시에 담을 수 있습니다.",
      score: score(input, 4),
    }),
    candidate({
      id: "career-bioinfo-3",
      title: "생명정보 데이터를 분석해 맞춤형 치료 가능성을 탐구하는 생명정보학자",
      job: "생명정보학자",
      modifier: "생명정보 데이터를 분석해 맞춤형 치료 가능성을 탐구하는",
      domain: ["생명", "정보", "연구"],
      problem: "개인별 치료 반응 차이",
      beneficiary: ["환자", "연구자", "의료진"],
      tools: ["유전체 데이터", "통계", "알고리즘"],
      contribution: "개인 맞춤형 의료 연구에 기여함",
      subjects: ["생명과학", "화학", "정보", "확률과 통계"],
      majors: ["생명정보학과", "생명공학과", "통계학과"],
      reason: "생명과 정보 분야 관심을 연구형 진로로 확장할 수 있습니다.",
      score: score(input, 4),
    }),
  ];
}

function generalCandidates(input) {
  return [
    candidate({
      id: "career-social-research-1",
      title: "학생의 관심 분야 문제를 조사하고 해결책을 제안하는 사회문제 연구원",
      job: "사회문제 연구원",
      modifier: "학생의 관심 분야 문제를 조사하고 해결책을 제안하는",
      domain: ["사회문제", "연구", "정책"],
      problem: first(input.targetProblems) || "관심 분야의 구조적 문제",
      beneficiary: ["지역사회", "청소년", "취약계층"],
      tools: ["자료 조사", "인터뷰", "통계 분석"],
      contribution: "문제 원인을 밝히고 실행 가능한 개선안을 제안함",
      subjects: ["사회문화", "국어", "확률과 통계"],
      majors: ["사회학과", "행정학과", "정책학과"],
      reason: "아직 진로가 명확하지 않아도 관심 분야와 문제의식을 중심으로 구체화할 수 있습니다.",
      score: score(input, 3),
    }),
    candidate({
      id: "career-data-planner-2",
      title: "관심 분야 데이터를 분석해 서비스 개선 방향을 찾는 데이터 기획자",
      job: "데이터 기획자",
      modifier: "관심 분야 데이터를 분석해 서비스 개선 방향을 찾는",
      domain: ["데이터", "기획", "서비스"],
      problem: first(input.targetProblems) || "사용자 불편과 정보 부족",
      beneficiary: ["서비스 이용자", "학생", "지역사회"],
      tools: ["데이터 분석", "사용자 조사", "시각화"],
      contribution: "데이터를 근거로 더 나은 서비스를 설계함",
      subjects: ["정보", "확률과 통계", "사회문화"],
      majors: ["데이터사이언스학과", "경영학과", "산업공학과"],
      reason: "관심 분야를 데이터 분석과 기획 역량으로 연결할 수 있습니다.",
      score: score(input, 3),
    }),
    candidate({
      id: "career-public-designer-3",
      title: "사람들의 불편을 발견하고 공공 해결책을 설계하는 공공서비스 디자이너",
      job: "공공서비스 디자이너",
      modifier: "사람들의 불편을 발견하고 공공 해결책을 설계하는",
      domain: ["서비스", "공공", "디자인"],
      problem: first(input.targetProblems) || "생활 속 접근성 문제",
      beneficiary: ["시민", "학생", "공공서비스 이용자"],
      tools: ["관찰", "프로토타입", "정책 조사"],
      contribution: "사용자 중심으로 공공서비스의 접근성과 만족도를 높임",
      subjects: ["사회문화", "미술", "국어", "정보"],
      majors: ["서비스디자인학과", "행정학과", "사회학과"],
      reason: "문제 발견과 해결 아이디어를 실제 서비스 설계로 발전시킬 수 있습니다.",
      score: score(input, 3),
    }),
  ];
}

function candidate(data) {
  return {
    id: data.id,
    career_title: data.title,
    base_job: data.job,
    modifier: data.modifier,
    domain: data.domain,
    target_problem: data.problem,
    beneficiary: data.beneficiary,
    tools: data.tools,
    contribution: data.contribution,
    related_subjects: data.subjects,
    related_majors: data.majors,
    reason: data.reason,
    fit_score: data.score,
  };
}

function variants(base, edits) {
  return edits.map(([modifier, reason], index) => ({
    ...base,
    id: `${base.id}-refined-${index + 1}`,
    modifier,
    career_title: `${modifier} ${base.base_job}`,
    domain: Array.from(new Set([...base.domain, refinedDomain(modifier)])),
    reason,
    fit_score: Math.min(5, base.fit_score + (index === 0 ? 1 : 0)),
  }));
}

function refinedDomain(text) {
  if (matches(text, ["데이터", "AI", "예측"])) return "데이터";
  if (matches(text, ["기술", "공학", "시스템"])) return "공학";
  if (matches(text, ["사회", "취약", "격차"])) return "사회문제";
  if (matches(text, ["연구", "이론"])) return "연구";
  return "전문성";
}

function score(input, base) {
  const bonus = input.careerStatus === "CLEAR" ? 0 : -1;
  return Math.max(3, Math.min(5, base + bonus));
}

function matches(text, keywords) {
  return keywords.some((keyword) => text.includes(normalize(keyword)));
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function first(values) {
  return values?.find(Boolean);
}
