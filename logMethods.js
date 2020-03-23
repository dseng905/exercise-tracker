const mongo = require('mongodb');
const mongooose = require('mongoose');
const userLogs = require('./models/userLogs.js');


exports.addNewUser = (req,res) => {
  const userName = req.body.username;

  userLogs.findOne({'username' : userName}, (err, userData) => {
    if(err) return;
    if(userData) {
      res.send("Username is taken.")
    }
    else {
      userLogs.create({'username' : userName}, (err, newUser) => {
        if(err) return;
        res.json({"_id" : newUser._id, "username": userName});
      })
    }
  })
}

exports.addExercise = (req,res) => {
  if(isNaN(Number(req.body.duration))) return res.send("Please insert a duration greater or equal to 0.");
  if(Number(req.body.duration) < 0) return res.send("Please insert a duration greater or equal to 0.");
  
  const parseDate = (date) => {
    const dateObj = new Date(date);
    return dateObj !== "Invalid Date" ? dateObj.toDateString() : Date.now();
  }

  const log = {
    "userId" : req.body.userId,
    "description" : req.body.description,
    "duration" : req.body.duration,
    "date" : parseDate(req.body.date)
  }

  userLogs.findOneAndUpdate({"_id" : req.body.userId}, {$push:{"log": log}}, (err,data) => {
    if(err) return;
    if(data) {
      res.json({
        "userId" : data._id,
        "username" : data.username,
        "description" : req.body.description,
        "duration" : req.body.duration,
        "date" : parseDate(req.body.date)
      });
    }
    else res.send("Username does not exist.");
  })
}


exports.getUserLog = (req,res) => {
  const to = new Date(req.query.to) != "Invalid Date" ? new Date(req.query.to) : new Date(8640000000000000);
  const from = new Date(req.query.from) != "Invalid Date" ? new Date(req.query.from) : new Date(-8640000000000000);

  userLogs.findOne({"_id" : req.query.userId}, (err,data) => {
      if(err) return;
      if(data) {
        const filteredLog = data.log.map(log => ({
            "description": log.description,
            "duration" : log.duration,
            "date" : log.date,
          }))
          .filter(data => {
            const parseDate = new Date(data.date);
            return parseDate >= from && parseDate <= to;
          })
          .sort((a,b) => new Date(a.date) - new Date (b.date))
          .slice(0, req.query.limit  ? parseInt(req.query.limit) : data.log.length);
  
        const newData = {
          "userId" : data._id,
          "username": data.username,
          "log" : filteredLog,
          "count" : filteredLog.length      
        };
  
        res.json(newData);
    } 
    else res.send("Username does not exist.")
  })
}
