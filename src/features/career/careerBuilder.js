import {
  buildMockCareerCandidates,
  refineMockCareerCandidates,
} from "./careerMock.js";

const STORAGE_KEY = "careerIdentity";

const feedbackOptions = [
  "더 구체적으로",
  "더 현실적인 직업으로",
  "더 연구자 성격으로",
  "더 전문직 성격으로",
  "더 사람을 돕는 방향으로",
  "더 기술/공학 중심으로",
  "더 데이터/AI 중심으로",
  "더 사회문제 중심으로",
  "다른 후보 더 보기",
];

/**
 * @param {HTMLElement} root
 */
export function initCareerBuilder(root) {
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const storedIdentity = readStoredIdentity();
  const state = {
    step: storedIdentity ? 5 : 1,
    careerStatus: "UNCLEAR",
    input: null,
    candidates: [],
    selectedCandidate: null,
    identity: storedIdentity,
    feedbackHistory: [],
  };

  root.addEventListener("click", (event) => {
    const target = event.target.closest("[data-career-action]");
    if (!target) return;

    const action = target.dataset.careerAction;
    const value = target.dataset.value;

    if (action === "set-status") {
      state.careerStatus = value;
      state.step = 2;
    }

    if (action === "back-status") {
      state.step = 1;
    }

    if (action === "build-candidates") {
      state.input = readCareerInput(root, state.careerStatus);
      state.candidates = buildMockCareerCandidates(state.input);
      state.step = 3;
    }

    if (action === "select-candidate") {
      state.selectedCandidate = state.candidates.find((item) => item.id === value);
      state.step = 4;
    }

    if (action === "confirm-candidate") {
      const candidate = state.candidates.find((item) => item.id === value);
      confirmCandidate(state, candidate);
    }

    if (action === "refine") {
      const feedback = value;
      state.feedbackHistory = [...state.feedbackHistory, feedback];
      state.candidates = refineMockCareerCandidates(
        state.input,
        state.selectedCandidate,
        feedback
      );
      state.step = 3;
    }

    if (action === "restart") {
      state.step = 1;
      state.input = null;
      state.candidates = [];
      state.selectedCandidate = null;
      state.feedbackHistory = [];
    }

    render(root, state);
  });

  render(root, state);
}

function render(root, state) {
  root.innerHTML = `
    <section class="career-builder">
      <div class="career-heading">
        <p class="section-label">진로 확정 1차 뼈대</p>
        <h2>진로 정체성 만들기</h2>
        <p>막연한 관심사를 구체적인 수식어 + 직업 형태의 진로 후보로 바꿔봅니다.</p>
      </div>
      ${renderProgress(state.step)}
      ${renderCurrentStep(state)}
    </section>
  `;
}

function renderProgress(step) {
  const labels = ["상태", "입력", "후보", "피드백", "확정"];
  return `
    <ol class="career-progress" aria-label="진로 확정 단계">
      ${labels
        .map(
          (label, index) => `
            <li class="${step >= index + 1 ? "active" : ""}">
              <span>${index + 1}</span>${label}
            </li>
          `
        )
        .join("")}
    </ol>
  `;
}

function renderCurrentStep(state) {
  if (state.step === 1) return renderStatusStep();
  if (state.step === 2) return renderInputStep(state);
  if (state.step === 3) return renderCandidateStep(state);
  if (state.step === 4) return renderFeedbackStep(state);
  return renderIdentityStep(state.identity);
}

function renderStatusStep() {
  return `
    <div class="career-panel">
      <h3>확실한 진로가 있나요?</h3>
      <div class="career-choice-row">
        <button class="primary-button compact" type="button" data-career-action="set-status" data-value="CLEAR">
          있어요
        </button>
        <button class="ghost-button compact" type="button" data-career-action="set-status" data-value="UNCLEAR">
          아직 모르겠어요
        </button>
      </div>
    </div>
  `;
}

function renderInputStep(state) {
  const isClear = state.careerStatus === "CLEAR";
  return `
    <form class="career-panel career-form" onsubmit="return false">
      <div>
        <h3>학생 정보 입력</h3>
        <p class="muted">콤마로 여러 항목을 입력할 수 있습니다.</p>
      </div>

      <label>
        현재 학년
        <select name="grade">
          <option value="">선택 안 함</option>
          <option>중1</option>
          <option>중2</option>
          <option>중3</option>
          <option>고1</option>
          <option>고2</option>
          <option>고3</option>
        </select>
      </label>

      <label class="${isClear ? "" : "is-hidden"}">
        희망 진로
        <input name="rawCareerInput" placeholder="변호사, 전기공학자, 의사, 심리학자" />
      </label>

      <label>
        관심 분야
        <input name="interests" placeholder="노인, 법, 복지, 데이터, 환경" />
      </label>

      <label>
        좋아하는 과목
        <input name="favoriteSubjects" placeholder="정치와 법, 사회문화, 확률과 통계" />
      </label>

      <label>
        해결하고 싶은 문제
        <input name="targetProblems" placeholder="노인 법률 사각지대, 지역 격차" />
      </label>

      <label>
        선호 방향
        <input name="preference" placeholder="사회문제를 해결하는 전문직 성격" />
      </label>

      <label>
        피하고 싶은 방향
        <input name="avoidance" placeholder="너무 공학적인 방향은 피하고 싶음" />
      </label>

      <div class="career-actions">
        <button class="ghost-button compact" type="button" data-career-action="back-status">이전</button>
        <button class="primary-button compact" type="button" data-career-action="build-candidates">
          진로 후보 만들기
        </button>
      </div>
    </form>
  `;
}

function renderCandidateStep(state) {
  return `
    <div class="career-panel">
      <div class="career-panel-header">
        <div>
          <h3>진로 후보 카드</h3>
          <p class="muted">각 후보는 구체적인 수식어와 직업명을 함께 포함합니다.</p>
        </div>
        <button class="ghost-button compact" type="button" data-career-action="restart">처음부터</button>
      </div>
      <div class="career-cards">
        ${state.candidates.map(renderCandidateCard).join("")}
      </div>
    </div>
  `;
}

function renderCandidateCard(candidate) {
  return `
    <article class="career-card">
      <div class="career-card-topline">
        <span>적합도 ${candidate.fit_score}/5</span>
      </div>
      <h4>${escapeHtml(candidate.career_title)}</h4>
      <p>${escapeHtml(candidate.reason)}</p>
      ${renderTags(candidate.domain)}
      <dl>
        <div>
          <dt>해결 문제</dt>
          <dd>${escapeHtml(candidate.target_problem)}</dd>
        </div>
        <div>
          <dt>관련 과목</dt>
          <dd>${escapeHtml(candidate.related_subjects.join(", "))}</dd>
        </div>
        <div>
          <dt>관련 학과</dt>
          <dd>${escapeHtml(candidate.related_majors.join(", "))}</dd>
        </div>
      </dl>
      <div class="career-actions">
        <button class="primary-button compact" type="button" data-career-action="confirm-candidate" data-value="${candidate.id}">
          이 진로로 확정
        </button>
        <button class="ghost-button compact" type="button" data-career-action="select-candidate" data-value="${candidate.id}">
          후보 수정하기
        </button>
      </div>
    </article>
  `;
}

function renderFeedbackStep(state) {
  return `
    <div class="career-panel">
      <div class="career-panel-header">
        <div>
          <h3>어떤 방향으로 조정할까요?</h3>
          <p class="muted">${escapeHtml(state.selectedCandidate.career_title)}</p>
        </div>
      </div>
      <div class="feedback-grid">
        ${feedbackOptions
          .map(
            (option) => `
              <button class="ghost-button compact" type="button" data-career-action="refine" data-value="${option}">
                ${option}
              </button>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderIdentityStep(identity) {
  if (!identity) return "";

  return `
    <div class="career-panel identity-panel">
      <p class="section-label">확정 결과</p>
      <h3>최종 진로가 확정되었습니다.</h3>
      <h4>${escapeHtml(identity.career_title)}</h4>
      <dl>
        <div><dt>기본 직업</dt><dd>${escapeHtml(identity.base_job)}</dd></div>
        <div><dt>분야</dt><dd>${escapeHtml(identity.domain.join(", "))}</dd></div>
        <div><dt>해결 문제</dt><dd>${escapeHtml(identity.target_problem)}</dd></div>
        <div><dt>수혜자</dt><dd>${escapeHtml(identity.beneficiary.join(", "))}</dd></div>
        <div><dt>활용 도구</dt><dd>${escapeHtml(identity.tools.join(", "))}</dd></div>
        <div><dt>기여 방식</dt><dd>${escapeHtml(identity.contribution)}</dd></div>
        <div><dt>관련 과목</dt><dd>${escapeHtml(identity.related_subjects.join(", "))}</dd></div>
        <div><dt>관련 학과</dt><dd>${escapeHtml(identity.related_majors.join(", "))}</dd></div>
        <div><dt>이유</dt><dd>${escapeHtml(identity.reason)}</dd></div>
      </dl>
      <div class="career-actions">
        <button class="ghost-button compact" type="button" data-career-action="restart">새 진로 만들기</button>
      </div>
    </div>
  `;
}

function readCareerInput(root, careerStatus) {
  const form = root.querySelector(".career-form");
  return {
    grade: fieldValue(form, "grade"),
    careerStatus,
    rawCareerInput: fieldValue(form, "rawCareerInput"),
    interests: splitList(fieldValue(form, "interests")),
    favoriteSubjects: splitList(fieldValue(form, "favoriteSubjects")),
    targetProblems: splitList(fieldValue(form, "targetProblems")),
    preference: fieldValue(form, "preference"),
    avoidance: fieldValue(form, "avoidance"),
  };
}

function confirmCandidate(state, candidate) {
  state.identity = {
    ...candidate,
    confirmed_at: new Date().toISOString(),
    feedback_history: state.feedbackHistory,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.identity));
  state.step = 5;
}

function readStoredIdentity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function fieldValue(form, name) {
  return form?.elements?.[name]?.value?.trim() ?? "";
}

function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderTags(items) {
  return `
    <div class="career-tags">
      ${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
