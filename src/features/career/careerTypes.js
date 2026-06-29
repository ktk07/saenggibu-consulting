/**
 * @typedef {"CLEAR" | "UNCLEAR"} CareerStatus
 */

/**
 * @typedef {Object} CareerInput
 * @property {string=} grade
 * @property {CareerStatus} careerStatus
 * @property {string=} rawCareerInput
 * @property {string[]} interests
 * @property {string[]} favoriteSubjects
 * @property {string[]=} targetProblems
 * @property {string=} preference
 * @property {string=} avoidance
 */

/**
 * @typedef {Object} CareerCandidate
 * @property {string} id
 * @property {string} career_title
 * @property {string} base_job
 * @property {string} modifier
 * @property {string[]} domain
 * @property {string} target_problem
 * @property {string[]} beneficiary
 * @property {string[]} tools
 * @property {string} contribution
 * @property {string[]} related_subjects
 * @property {string[]} related_majors
 * @property {string} reason
 * @property {number} fit_score
 */

/**
 * @typedef {CareerCandidate & {
 *   confirmed_at: string,
 *   feedback_history?: string[]
 * }} CareerIdentity
 */

export {};
