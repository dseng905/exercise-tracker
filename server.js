const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const app = express();
const logMethods = require('./logMethods.js')

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(__dirname + '/public'));
app.get('/', (req,res) => res.sendFile(__dirname + '/views/index.html'));

//Connect to MongoDB Server
const mongoURI = 'ADD MONGODB URI HERE';
mongoose.connect(mongoURI, {useNewUrlParser: true,useUnifiedTopology: true});

//TODO: Define the middleware function for each POST and GET request
app.post('/api/exercise/new-user', logMethods.addNewUser);
app.post('/api/exercise/add', logMethods.addExercise);
app.get('/api/exercise/log', logMethods.getUserLog);

//If page is not found
app.use((req,res,next) => {
  res.status(404)
  .type('text')
  .send('Page not found');
});

app.listen(process.env.PORT || 3000, () => console.log("App is listening..."));
