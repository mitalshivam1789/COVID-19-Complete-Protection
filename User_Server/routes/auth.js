const express = require('express'),
router = express.Router(),
passport = require('passport');

router.post("/register_login", (req, res, next) =>{
  passport.authenticate("local", function(err, user, info){
    if(err){
      return res.status(400).json({err});
    }

    if(!user){
      return res.status(400).json({errors : "No User Found"});
    }

    req.logIn(user, function(err){
      if(err){
        return res.status(400).json({errors : "err"});
      }
      return res.status(200).json({success : `${user.id}`});
    });
  })(req, res, next);
});

module.exports = router;
