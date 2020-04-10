const express = require('express'),
router = express.Router(),
passport = require('passport');
user = require('../models/patients');
app = express();
app.set('view-engine', 'ejs');
const Coordinates = require('../models/coordinates');

router.post("/", checkAuthenticated, function(req, res){
    // console.log(req.body.active);
    user.find({email : req.body.email}, function(err, person){
      if(err){
        // console.log(err);
      }else{
        // console.log(person);
        res.render("../views/index.ejs", {name : 'Welcome Doctor', person : person});
      }
    })
})


router.post("/coordinates", checkAuthenticated, function(req, res){
    // console.log(req.body.active);
    Coordinates.find({x : req.body.x, y : req.body.y}, function(err, coordinate){
      if(err){
        // console.log(err);
      }else{
        // console.log(person);
        res.render("../views/coordinate.ejs", {Coordinate : coordinate});
      }
    })
})

//This route is to update status of a person
router.put('/update/:id/', checkAuthenticated, function(req, res){
  // console.log(req.params.id);
  // console.log(req.body);
  var value;
  if(req.body.bool === 'false'){
    value = {active : true}
  }else{
    value = {active : false}
  }
  // console.log("Value is : ",value);
  user.findOneAndUpdate({_id : req.params.id},
    {$set : value},
    {returnNewDocument: true},
    function(err, res){
      if(err){
        // console.log("Error ", err);
      }else if(req.body.bool === 'false'){
        // console.log("Result is ", res);
        var result;
        result = res;
        // console.log("Result : ");
        var x = result.locs[result.locs.length-1].x;
        var y = result.locs[result.locs.length-1].y;
        // console.log(x);
        // console.log(Number(x));
        // console.log(y);
        var i;
        var j;
        var count = 1;
        // (Number(x)*10000-1*10)
        for(i = -10; i <=10; i= i +=1){
          for(j = -10; j <=10; j+=1){
            var itemp = (Number(x)*10000-i)/10000;
            var jtemp = (Number(y)*10000-j)/10000;
            // console.log(itemp.toString(), jtemp.toString());
            count = count + 1;
            Coordinates.findOneAndUpdate({x : itemp.toString(), y : jtemp.toString()}, {Indanger : true},function(err, res){
              if(res){
                // console.log("Updated");
              }
            });
          }
        }
        // console.log("Count : ",count);
      }
    });
  res.render("../views/index.ejs", {name : 'Welcome Doctor', person : []});
})

//Check for authentication
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('login')
}

module.exports = router;
