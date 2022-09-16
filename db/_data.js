const mongoose = require('mongoose');

const x = {
  type: String,
  required: false,
};
const schema = new mongoose.Schema({
   email: x,
  pass: x,
 
});

const Model = mongoose.model('data', schema);

module.exports = Model;
