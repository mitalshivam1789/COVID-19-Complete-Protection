const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema({
  x : {
    type : String,
    required : true
  },
  y : {
    type : String,
    required : true
  },
  Indanger : {
    type : Boolean,
    default : false
  },
  users : [{
    email : {type : String},
    present_at : Date
  }]
});

module.exports = coordinate = mongoose.model("coordinates", coordinatesSchema);
