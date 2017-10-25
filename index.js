const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fileName = 'users.json'

const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: false
}));

app.set('view engine', 'pug');
// Route 1 : Index
app.get('/', (req, res) => {
   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err;
      }

      let jsonData = JSON.parse(data);
      res.render('index', {
         file: jsonData
      });
   });

});

// Route 2 : Search bar
app.get('/search', (req, res) => {
   res.render('search');
});

// Route 3 : Search Results
app.post('/userDetails', (req, res) => {
   let searchData = req.body

   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err;
      }

      let jsonData = JSON.parse(data);

      for (let i = 0; i < jsonData.length; i++) {

         // const searchName = searchData.firstname.replace(/\s+/g, '');
         // If you would prefer matching first and last name format
         // let jsonName = jsonData[i].firstname + jsonData[i].lastname;

         if (jsonData[i].firstname.toLowerCase() === searchData.name.toLowerCase() ||
            jsonData[i].lastname.toLowerCase() === searchData.name.toLowerCase()) {
            res.render('searchResults', {
               results: jsonData[i]
            });
            return;
         } else if (i === jsonData.length - 1) {
            res.render('searchResults');
         }
      }


   });
});
// Route 4 : Add user page

app.get('/addMe', (req, res) => {
   res.sendFile(path.resolve('./public/addUser.html'));
});


app.get('/search_data', (req, res) => {
   let input = req.query.input.toLowerCase();
   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err
      }
      const parsedJson = JSON.parse(data);

      let output = parsedJson.find(element => {
         let firstName = element.firstname.toLowerCase()
         let lastName = element.lastname.toLowerCase()

         if(input !== '') {
            if (firstName.indexOf(input) > -1){
               return element;
            } else if (lastName.indexOf(input) > -1) {
               return element;
            }
         }
      })

      res.send({
         user: output
      })
   })

});
// Route 5 : Add user and redirects to home page
app.post('/addedUser', (req, res) => {
   const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
   };

   fs.readFile(fileName, (err, data) => {
      if (err) {
         throw err;
      }

      let json = JSON.parse(data)

      json.push(newUser);

      fs.writeFile(fileName, JSON.stringify(json));

      res.redirect('/');
   });
});
var server = app.listen(3000, () => {
   console.log(`Server's working just fine on port 3000!`);
});
