const mongo = require('mongodb');
const mongoose = require('mongoose');


const userLogs = new mongoose.Schema({
  "username" : String,
  "log" : [{
    "description" : String,
    "duration" : Number,
    "date" : String,
  }]
})

module.exports = mongoose.model('userLogs', userLogs);