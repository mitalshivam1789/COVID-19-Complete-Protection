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
  active : {
    type : Boolean,
    default : false
  },
  Indanger : {
    type : Boolean,
    default : false
  },
  currentAddress : {
    type : String,
    default : "Empty"
  }
});

module.exports = User = mongoose.model("User", UserSchema);
