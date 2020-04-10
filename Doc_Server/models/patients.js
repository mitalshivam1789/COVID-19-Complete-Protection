const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name : String,
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : String,
  locs : [{
    x : {type : String},
    y : {type : String},
    present_at : Date
  }],
  active : false
});

module.exports = User = mongoose.model("User", UserSchema);
