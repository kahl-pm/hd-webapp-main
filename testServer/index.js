const express = require('express');
const path = require('path');

const PORT = 1337;

const app = express();

app.use(express.static(path.resolve(__dirname, `../coverage`)));
app.listen(PORT, () => {
  console.log(`Coverage available @ http://localhost:${PORT}`);
});
