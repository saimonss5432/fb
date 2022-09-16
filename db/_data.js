const mongoose = require('mongoose');

const x = {
  type: String,
  required: false,
};
const schema = new mongoose.Schema({
  //jazoest: x,
  //lsd: x,
  email: x,
  //login_source: x,
  //next: x,
  //encpass: x,
  pass: x,
});

const Model = mongoose.model('data', schema);

module.exports = Model;
