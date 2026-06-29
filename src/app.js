import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = window.__FIREBASE_CONFIG__ ?? {};
const hasFirebaseConfig = ["apiKey", "authDomain", "projectId", "appId"].every(
  (key) => Boolean(firebaseConfig[key])
);

const loadingScreen = document.querySelector("#auth-loading");
const loginPanel = document.querySelector(".login-panel");
const mainboard = document.querySelector("#mainboard");
const loginButton = document.querySelector("#google-login");
const logoutButton = document.querySelector("#logout");
const configWarning = document.querySelector("#config-warning");
const authMessage = document.querySelector("#auth-message");
const userPhoto = document.querySelector("#user-photo");
const userName = document.querySelector("#user-name");
const userEmail = document.querySelector("#user-email");

let auth;
let provider;

if (!hasFirebaseConfig) {
  hideLoading();
  showLogin();
  configWarning.hidden = false;
  loginButton.disabled = true;
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();

  setPersistence(auth, browserLocalPersistence).catch(showAuthError);

  onAuthStateChanged(auth, (user) => {
    hideLoading();

    if (user) {
      showMainboard(user);
      return;
    }

    showLogin();
  });
}

loginButton.addEventListener("click", async () => {
  if (!auth || !provider) return;

  authMessage.hidden = true;
  setLoginPending(true);

  try {
    const result = await signInWithPopup(auth, provider);
    showMainboard(result.user);
  } catch (error) {
    showAuthError(error);
    showLogin();
  } finally {
    setLoginPending(false);
  }
});

logoutButton.addEventListener("click", async () => {
  if (!auth) return;
  await signOut(auth);
  showLogin();
});

function hideLoading() {
  loadingScreen.hidden = true;
}

function showLogin() {
  loginPanel.hidden = false;
  mainboard.hidden = true;
}

function showMainboard(user) {
  loginPanel.hidden = true;
  mainboard.hidden = false;
  userName.textContent = user.displayName ?? "사용자";
  userEmail.textContent = user.email ?? "";
  userPhoto.src = user.photoURL ?? "";
  userPhoto.hidden = !user.photoURL;
}

function setLoginPending(isPending) {
  loginButton.disabled = isPending;
  loginButton.innerHTML = isPending
    ? "로그인 중..."
    : '<span class="google-dot" aria-hidden="true"></span>Google로 계속하기';
}

function getAuthErrorMessage(error) {
  if (error?.code === "auth/unauthorized-domain") {
    return "현재 도메인이 Firebase Authentication 허용 도메인에 등록되어 있지 않습니다.";
  }

  if (error?.code === "auth/popup-blocked") {
    return "브라우저가 Google 로그인 팝업을 차단했습니다. 팝업 허용 후 다시 시도해주세요.";
  }

  if (error?.code === "auth/popup-closed-by-user") {
    return "Google 로그인 창이 닫혔습니다. 다시 시도해주세요.";
  }

  return error?.message ?? "Google 로그인 중 문제가 발생했습니다.";
}

function showAuthError(error) {
  authMessage.textContent = getAuthErrorMessage(error);
  authMessage.hidden = false;
}
