const express = require('express'),
router = express.Router(),
passport = require('passport');
User = require('../models/User'),
Coordinates = require('../models/coordinates')

router.post("/xy", (req, res, next) =>{
    // console.log(req.body);
    var values = {x : req.body.x, y : req.body.y, present_at : Date.now()};
    // console.log(values);
    Coordinates.findOne({x : req.body.x, y : req.body.y}, function(err, result){
      if(err || result == null){
        Coordinates.create({x : req.body.x, y : req.body.y, users : [{email : req.body.email, present_at : Date.now()}]}, function(err1, result1){
          if(err1){
            console.log("Error1");
          }else{
            console.log(result1);
          }
        })
      }else{
        Coordinates.findOneAndUpdate(
          {x : req.body.x, y : req.body.y},
          { $push : { users : {email : req.body.email, present_at : Date.now()}}},
          function(error, added){
            if(error){
              console.log("Error Here");
            }else{
              console.log("Added : ", added);
            }
          }
        )
        console.log(result);
      }
    })
    User.findOneAndUpdate(
      { email : req.body.email},
      { $push : { locs : values } },
      function(error, success){
        if(error){
          // console.log(error);
          return res.status(400).json({errors : "err"});
        }else{
          // console.log(success);
          return res.status(200).json({Success : "Success"});
        }
      });
});


//here we first check if present coordinates stored in database if yes then check is that coordinates in in danger or note
//If not in danger then search nearby 100 meter if their is any danger
//0.001 change means change in 100 meter
//We are checking within 160 meters of a person
//if status is 200 then that person himself suffering
//if status is 300 then danger someone has corona nearby
//if status is 400 then safe

router.post('/check', function(req, res){
  // console.log(req.body);
  User.find({email : req.body.email}, function(err, response){
    if(err){
      res.sendStatus(400);
    }else{
      // console.log(response);
      var result = response[0];
      // console.log("Result : ", result.locs);
      if(result.active === true){
        return res.sendStatus(200);
      }else if(result.Indanger == true){
        return res.sendStatus(300);
      }
      else{
        var x = result.locs[result.locs.length-1].x;
        var y = result.locs[result.locs.length-1].y;
        // console.log(x);
        // console.log(y);
        Coordinates.findOne({x : x, y: y}, function(err, resp){
          if(resp && resp != null){
            var tempResult = resp;
            // console.log("Result is : ", resp);
            if(resp.Indanger === true){
              return res.sendStatus(300);
            }else{
              var i;
              var j;
              var c = 1;
              for(i = -10; i <=10; i= i +=1){
                for(j = -10; j <=10; j+=1){
                  var itemp = (Number(x)*10000-i)/10000;
                  var jtemp = (Number(y)*10000-j)/10000;
                  // console.log(itemp.toString(), jtemp.toString());
                  Coordinates.findOne({x : itemp.toString(), y : jtemp.toString()}, function(err, responseFind){
                    if(responseFind){
                      var temp = responseFind;
                      if(temp.Indanger === true){
                        c = 0;
                        // return res.sendStatus(300);
                      }
                    }
                  });
                }
              }
              if(c === 0){
                return res.sendStatus(300);
              }else{
                return res.sendStatus(400);
              }
            }
          }else{
            // console.log("Do Nothing");
            res.sendStatus(400);
          }
        })
      }
    }
  })
})

module.exports = router;
