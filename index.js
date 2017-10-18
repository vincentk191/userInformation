const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fileName = 'users.json'

const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Route 1
app.get('/',(req,res) => {
   fs.readFile(fileName, (err,data) => {
      if(err){
         throw err;
      }

      let jsonData = JSON.parse(data);
      res.send(jsonData);
   });

});

// Route 2
app.get('/searchOne',(req,res) => {
   res.sendFile(path.resolve('./public/search.html'));
});

// Route 3
app.post('/userDetails', (req,res) => {
   let searchData = req.body

   fs.readFile(fileName, (err,data) => {
      if(err){
         throw err;
      }

      let jsonData = JSON.parse(data);

      for(let i = 0; i < jsonData.length; i++){

         // const searchName = searchData.firstname.replace(/\s+/g, '');
         // If you would prefer matching first and last name format
         // let jsonName = jsonData[i].firstname + jsonData[i].lastname;

         if(jsonData[i].firstname === searchData.name ||
            jsonData[i].lastname === searchData.name ){
            res.send(jsonData[i]);
         }
      }
      res.send('No match.');

   });
});
// Route 4

app.get('/addMe', (req,res) => {
   res.sendFile(path.resolve('./public/addUser.html'));
});
// Route 5
app.post('/addedUser', (req,res) => {
   const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
   };

   fs.readFile(fileName, (err, data) => {
      if(err){
         throw err;
      }

      let json = JSON.parse(data)
      
      console.log(newUser);

      json.push(newUser);

      console.log(JSON.stringify(json));

      fs.writeFile(fileName, JSON.stringify(json));

      res.redirect('/');
   });
});
var server = app.listen(3000, () => {
   // console.log(`Server's working just fine on port 3000!`);
   console.log(fileName);
});
