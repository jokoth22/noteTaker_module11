// Import express package
const express = require ('express');
const path = require ('path');
const notes= require ('./db.json');
const fs =require('fs');
const {v4: uuidv4} = require ('uuid');
// Initialize our app variable by setting it to the value of express()
const app= express();
const PORT = 3001;

//Use middleware to parse JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Serve the front-end files using Express static middleware.
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/')));

app.get('/', (req, res) => res.send('Visit http://localhost:3001/api'));

//Creates HTML routes that will serve up index.html & notes.html
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

///////Next part/////
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      res.json(JSON.parse(data));
    });
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = { ...req.body, id: uuidv4() };
  
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      notes.push(newNote);
  
      fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
      });
    });
  });

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);