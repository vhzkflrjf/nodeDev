// index.js
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (_, res) => {
  res.send('<h1>Hello from Node.js + Docker!</h1>');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
