// index.js
const express = require('express');
const app = express();
app.disable('x-powered-by');
const port = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// static 파일 (index.html)을 제공할 폴더
app.use(express.static('public'));

// POST 요청 처리
app.post('/api/data', (req, res) => {
  console.log('📥 Received data:', req.body);
  res.json({ message: '서버가 데이터를 잘 받았습니다!', received: req.body });
});

app.listen(port, () => {
  console.log(`🚀 서버가 실행 중입니다: http://localhost:${port}`);
});

app.get('/getget', (req, res) => {
  console.log(`🚀 요청을 받았습니다: http://localhost:${port}`);
  res.send('Hello!');
});
