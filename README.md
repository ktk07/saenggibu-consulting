# 생기부 컨설팅 프로그램

Firebase Google Auth를 사용하는 정적 웹 앱 초안입니다.

## Firebase 설정

1. Firebase Console에서 웹 앱을 생성합니다.
2. Authentication > Sign-in method에서 Google Provider를 활성화합니다.
3. `firebase-config.js`에 웹 앱 설정값을 입력합니다.
4. 배포 도메인을 Firebase Authentication > Settings > Authorized domains에 추가합니다.

```js
window.__FIREBASE_CONFIG__ = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID",
};
```

## 실행

정적 파일만으로 동작하므로 로컬에서는 `index.html`을 열면 됩니다.

Vercel에는 프로젝트 루트를 그대로 배포하면 됩니다.
