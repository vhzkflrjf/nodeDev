
# Node.js Devcontainer 협업 및 Docker 사용 가이드

## ✅ 1단계: Git으로 협업 가능한 Devcontainer 프로젝트 구성

### 📁 프로젝트 구조 예시

```
project-root/
├── .devcontainer/
│   └── devcontainer.json
├── index.js
├── package.json
├── public/
│   └── index.html
├── .gitignore
└── README.md
```

### 🛠️ Git 초기화 및 푸시

```bash
git init
git add .
git commit -m "Initial commit with devcontainer and express server"
git remote add origin <GitHub_URL>
git push -u origin main
```

### 👥 다른 개발자 사용 방법

```bash
git clone <GitHub_URL>
cd project-root
# VSCode에서 폴더 열기
# Remote Containers: Reopen in Container 클릭
```

---

## ✅ 2단계: Docker 명령어로 수동 컨테이너 제어 (`build`, `run` 등)

### 🧱 Dockerfile 예시 (`.devcontainer/Dockerfile`)

```Dockerfile
FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm
WORKDIR /workspace
COPY . .
RUN npm install
CMD ["node", "index.js"]
```

### 🧪 실행 방법

```bash
docker build -t my-node-app -f .devcontainer/Dockerfile .
docker run -d -p 3000:3000 --name node-server my-node-app
docker stop node-server
docker rm node-server
```

---

## ✅ 3단계: 배포된 도커 이미지 활용 (`docker pull` 등)

### 🐳 이미지 푸시 및 사용 예시

```bash
docker login
docker tag my-node-app yourusername/my-node-app:latest
docker push yourusername/my-node-app:latest
```

### 🔄 다른 개발자 실행

```bash
docker pull yourusername/my-node-app:latest
docker run -d -p 3000:3000 yourusername/my-node-app:latest
```

---

## ❗ 추가 개발 및 Git 커밋이 가능한가?

### ❌ 기본 `docker run`만 사용 시

- 컨테이너 안에서 변경한 파일은 호스트에 반영되지 않음
- 커밋해도 로컬에는 적용되지 않음

### ✅ `-v` 옵션으로 볼륨 연결 시

```bash
docker run -it -p 3000:3000 \
  -v $(pwd):/workspace \
  -w /workspace \
  yourusername/my-node-app:latest /bin/bash
```

> 이렇게 실행하면 **컨테이너 안에서 파일을 수정하거나 Git 커밋을 해도 로컬에 그대로 반영됨**

---

## ✅ 비교 요약

| 사용 방식 | 개발 가능 | 커밋 가능 | 로컬 반영 |
|-----------|------------|------------|------------|
| `docker run` (볼륨 없음) | 가능 | 가능 | ❌ |
| `docker run -v $(pwd):/workspace` | 가능 | 가능 | ✅ |
| VSCode Devcontainer | 가능 | 가능 | ✅ |
