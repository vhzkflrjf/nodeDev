# 📦 VSCode Devcontainer + Dockerfile 완전 이해 가이드 (Node.js 기준)

## 1. Devcontainer 구성 방식 차이

| 항목 | Dockerfile 없이 사용 | Dockerfile 사용 |
|------|----------------------|----------------|
| 베이스 이미지 | 고정 이미지 (`image`) | 직접 커스터마이징 |
| 설치 명령 실행 위치 | 컨테이너 **실행 후** | 컨테이너 **빌드 시** |
| 속도 | 느림 (매번 설치됨) | 빠름 (1회 설치) |
| 커스터마이징 유연성 | 제한적 | 매우 높음 |
| 협업 시 재현성 | 낮음 | 높음 ✅ |

---

## 2. Devcontainer 작동 원리 요약

1. VSCode가 `.devcontainer/devcontainer.json`을 감지
2. `image` 또는 `Dockerfile` 기준으로 컨테이너 **이미지 빌드**
3. 컨테이너 실행 + VSCode 자동 연결
4. `postCreateCommand` 및 `postStartCommand` 등 실행

---

## 3. Dockerfile 구성 예시

`.devcontainer/Dockerfile`:

```dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

WORKDIR /workspace
COPY . .
RUN npm install

CMD ["node", "index.js"]
```

---

## 4. devcontainer.json 구성 예시

`.devcontainer/devcontainer.json`:

```json
{
  "name": "Node.js & TypeScript",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },
  "forwardPorts": [3000],
  "postStartCommand": "node index.js"
}
```

---

## 5. 핵심 문제 해결 요약

### ❗ 오류 메시지

```
npm ERR! enoent Could not read package.json
```

### ✅ 원인
- Dockerfile 빌드 컨텍스트가 `.devcontainer/`로만 되어 있어서 `package.json`을 못 찾음

### ✅ 해결
- `"context": ".."` 로 변경하여 상위 디렉토리까지 포함

---

## 6. forwardPorts는 왜 Dockerfile이 아닌가?

| 항목 | 설명 |
|------|------|
| Dockerfile | 컨테이너 안에서 뭘 할지 정의 (`RUN`, `CMD`, 등) |
| devcontainer.json | **VSCode가 외부와 어떻게 연결할지 정의** (`forwardPorts`, `postCreateCommand`, 등) |

`"forwardPorts": [3000]` 은 VSCode가 `localhost:3000` → 컨테이너로 연결하는 설정이며, Dockerfile의 `EXPOSE`와는 기능이 다름

---

## 7. Devcontainer 전환 시 체감 변화

- 빌드시 `npm install` 포함됨 → 실행 속도 개선
- 커스터마이징 가능 (예: nginx, python 등)
- 컨테이너 재현성 향상 → 협업에 유리