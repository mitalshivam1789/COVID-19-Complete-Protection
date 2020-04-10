const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name : String,
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : String,
});

module.exports = Doctor = mongoose.model("Doctor", UserSchema);
