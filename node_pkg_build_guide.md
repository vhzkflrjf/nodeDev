# Devcontainer 기반 Node.js 서버 실행파일 패키징 가이드

## 🎯 목표

- 도커 데스크탑 없이도 실행 가능한 Node.js 서버 패키지 만들기
- Devcontainer 안에서 개발 및 빌드 진행
- 실행파일(.exe) 형태로 배포 가능
- PM2처럼 백그라운드 실행되게 구성하는 방법 검토

---

## ✅ 1단계: Devcontainer 기반 서버 개발

기존 Devcontainer 설정에서 Node.js + Express 서버가 구성된 상태로 시작.

예시 `index.js`:

```js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/data', (req, res) => {
  console.log('📥 Received data:', req.body);
  res.json({ message: '서버가 데이터를 잘 받았습니다!', received: req.body });
});

app.get('/getget', (req, res) => {
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`🚀 서버가 실행 중입니다: http://localhost:${port}`);
});
```

---

## ✅ 2단계: 실행파일 패키징 (`pkg`)

### 📦 `package.json` 수정

```json
{
  "name": "node-container-app",
  "version": "1.0.0",
  "main": "index.js",
  "bin": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

### 📦 `pkg` 설치 및 실행

```bash
npm install -g pkg
pkg . --targets node18-win-x64 --output dist/node-app.exe
```

---

## ✅ 3단계: 실행파일 전달 및 구성

최종 구성 예시:

```
portable-node-server/
├── node-app.exe
├── public/
│   └── index.html
```

---

## ✅ 4단계: PM2 형태 실행 지원

### ❌ pkg `.exe`는 PM2 기능 포함 불가

- PM2는 별도 프로세스 매니저
- `pkg`는 단일 실행파일만 생성

---

## ✅ 대안

### 대안 1: 사용자 측에서 PM2 설치 후 실행

```bash
npm install -g pm2
pm2 start node-app.exe --name my-app
```

---

### 대안 2: `.exe` 백그라운드 실행 (Windows 전용)

`run.bat`:

```bat
@echo off
start /b node-app.exe
```

---

### 대안 3: `node.exe` + `pm2` + index.js 번들

구성 예시:

```
portable-node-server/
├── node.exe
├── node_modules/
│   └── pm2/
├── index.js
├── package.json
└── run.bat
```

`run.bat` 내용:

```bat
@echo off
.
ode.exe .
ode_modules\pm2in\pm2 start index.js --name express-app --watch
pause
```

---

## ✅ 결론

| 방법 | PM2 기능 포함 | 도커 필요 없음 | 복잡도 |
|------|----------------|------------------|----------|
| `pkg` 단일 `.exe` | ❌ | ✅ | ⭐ 쉬움 |
| `.exe` + PM2 번들 | ✅ | ✅ | 🔶 중간 |
| PM2 설치 후 사용 | ✅ | ❌ (전역 설치 필요) | ⭐⭐ 쉬움 |
