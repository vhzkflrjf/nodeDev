
### 📁 `nodeContainer01` 폴더에서 Devcontainer 구성 방법 (Windows + VSCode 기준)

#### ✅ 1. 폴더 열기
- VSCode 실행 후 `nodeContainer01` 폴더를 연다  
  (VSCode 메뉴 → `File > Open Folder`)

---

#### ✅ 2. Devcontainer 시작하기
- 왼쪽 아래의 ![><](https://code.visualstudio.com/assets/docs/devcontainers/remote-indicator.png) **Remote 아이콘** 클릭
- `Dev Containers: Add Dev Container Configuration Files...` 또는 `New Dev Container` 선택  
- Dev Container 확장이 설치되지 않은 경우 자동으로 설치됨

---

#### ✅ 3. 구성 대상 선택

| 옵션 | 설명 | 추천 |
|------|------|------|
| **Add configuration to workspace** | 현재 열려있는 폴더 (`nodeContainer01`)에 `.devcontainer` 폴더와 설정 추가 | ✅ 사용 |
| **Add configuration to user data folder** | 전체 사용자 설정에 Devcontainer 환경 구성 | ❌ 사용하지 않음 |

→ **`Add configuration to workspace`** 선택

---

#### ✅ 4. 템플릿 선택

- `Node.js & TypeScript` 선택

---

#### ✅ 5. Node.js 버전 및 이미지 선택

- 예시 옵션: `18`, `20`, `22-bookworm`, `22-bullseye` 등

| 옵션 | 설명 | 권장도 |
|------|------|--------|
| **bookworm** | Debian 12 기반 (최신) | ✅ 추천 |
| **bullseye** | Debian 11 기반 (구버전, 안정성 위주) | 🔸 구형 환경만 필요할 때만 선택 |

→ **`22-bookworm`** 선택 권장

---

#### ✅ 6. 추가 기능 선택 (Select additional features to install)

| 기능 | 설명 | 추천 여부 |
|------|------|-----------|
| **Git** | 컨테이너 내부 Git 설치 | ❌ 생략 가능 (기본 포함됨) |
| **PNPM / Yarn** | 대체 패키지 매니저 | 🔸 필요 시 선택 |
| **GitHub CLI** | GitHub 연동 도구 | 🔸 필요 시 선택 |

> **보통은 아무것도 선택하지 않아도 충분히 작동함**

---

#### ✅ 7. 선택적 파일 포함 (Optional files)

```
Include the following optional files/directories:
- .github/dependabot.yml
```

| 파일 | 역할 | 선택 여부 |
|------|------|-----------|
| **dependabot.yml** | GitHub에서 의존성 자동 업데이트 설정 | 🔸 협업/오픈소스 환경에서만 추천 |

---

#### ✅ 8. Devcontainer 구성 완료 후

- `.devcontainer/` 폴더가 생성됨
  - 주요 파일: `devcontainer.json`, `Dockerfile` 등
- 설정이 완료되면 VSCode가 다음 메시지를 표시함:

```
Folder contains a Dev Container configuration file.
Reopen folder to develop in a container (learn more).
```

→ **Reopen in Container** 클릭 시,  
VSCode가 자동으로 Node.js Devcontainer 환경으로 전환됨 ✅

---

필요시 `.devcontainer/devcontainer.json` 파일을 직접 수정하여 포트, 확장, 커맨드 등을 세밀하게 커스터마이징할 수 있습니다.


# 📦 Devcontainer + Express 서버 구성 가이드

## 📁 기본 프로젝트 구조

```
/workspaces/nodeContainer01/
├── index.js
├── package.json
└── public/
    └── index.html
```

---

## 🚀 index.js 예시 코드

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
  console.log(`🚀 요청을 받았습니다: http://localhost:${port}`);
  res.send('Hello!');
});

app.listen(port, () => {
  console.log(`🚀 서버가 실행 중입니다: http://localhost:${port}`);
});
```

---

## 🌐 public/index.html 예시

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PM2 Fetch Test</title>
</head>
<body>
  <h1>Node.js 서버에 데이터 보내기</h1>
  <button onclick="sendData()">Send</button>
  <pre id="response"></pre>

  <script>
    async function sendData() {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: "Alice", time: new Date().toISOString() })
      });
      const result = await response.json();
      document.getElementById('response').textContent = JSON.stringify(result, null, 2);
    }
  </script>
</body>
</html>
```

---

## 🧰 서버 실행 방법

```bash
npm init -y
npm install express
node index.js
```

---

## 📌 Devcontainer 포트 포워딩 설정

### `forwardPorts`란?

`.devcontainer/devcontainer.json`에 다음 설정을 추가하면:

```json
"forwardPorts": [3000]
```

### 왜 필요한가?

| 이유 | 설명 |
|------|------|
| ✅ 자동 포워딩 보장 | 서버 실행 시 항상 외부 접근 가능 |
| ✅ 팀원 간 일관성 확보 | 컨테이너를 여는 사람마다 같은 포트 사용 |
| ✅ GitHub Codespaces 대응 | 리모트 환경에서도 동일하게 적용 |

### 단점

- `3000` 포트가 사용 중이면 **자동으로 3001 등으로 변경되지 않음**
- VSCode는 포트 충돌 메시지를 띄우지만, 포트 전환은 안 함

---

## 🛠️ 해결책: 환경변수 기반 포트 설정

`.env` 파일 사용:

```
PORT=3001
```

`index.js`에서 포트 동적으로 설정:

```js
const port = process.env.PORT || 3000;
```

실행:

```bash
PORT=3001 node index.js
```

---

## ⚙️ PM2를 사용한 백그라운드 실행

### 설치

```bash
npm install -g pm2
```

### 실행

```bash
pm2 start index.js --name express-app
```

### watch 모드

```bash
pm2 start index.js --name express-app --watch
```

### 상태 확인

```bash
pm2 list
```

### 로그 확인

```bash
pm2 logs express-app
```

### 재시작 / 종료

```bash
pm2 restart express-app
pm2 stop express-app
pm2 delete express-app
```

---

## ✅ 마무리 요약

| 설정 항목 | 권장 여부 | 이유 |
|-----------|------------|------|
| `"forwardPorts": [3000]` | ✅ 추천 | 협업 시 포트 일관성 보장 |
| PM2 사용 | ✅ 추천 | 백그라운드 실행 및 자동 재시작 |
| 환경 변수 포트 설정 | ✅ 필수 | 충돌 시 유연하게 대처 가능 |