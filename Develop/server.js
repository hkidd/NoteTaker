// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page

// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column

// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page

// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes

// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column

// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

// Required dependencies
const express = require("express");
const db = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const PORT = 3001;
const uuid = require('../helpers/uuid');

const app = express();

// Middleware for parsing application/json and url data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Client facing files are in a "public" folder, so the static method can be used
app.use(express.static("public"));

// We have GET, POST, and DELETE methods in the index.js for the '/api/notes' route
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for the api/notes route`);
    // this route should read the db.json file and return all saved notes as json
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received for the api/notes route`);
    // this route should recieve a new note to save on the request body, add it to the db.json file, and then return the new note to the client with a unique id (using uuid, like our previous example)

    // grabbing the request body and saving that as a "newNote"
    let newNote = req.body;

    // need to ad a unique id to this note (using uuid)
    newNote.id = uuid();

    // after adding unique id, this note should be added to the db.json file
    db.push(newNote);

    // Tried append file, but that was making it unhappy.  So overwriting the db file each time a new note is added
    fs.writeFile(`./db/db.json`, JSON.stringify(db), (err) =>
      err ? console.error(err) : console.log(`New Note has been written to JSON db`)
    );
    // Need to pass along the new db as a response
    res.send(db);
});

// Delete route needs to specific note id to delete the correct one
app.delete('/api/notes/:id', (req, res) => {
    console.info(`${req.method} request received for the api/notes route`);

});

// Need the get /notes route to return the notes.html file
app.get('/notes', (req, res) => {
    console.info(`${req.method} request received for the /notes route`);
    // the response should be to send the notes.html to the client
    res.sendFile(path.join(__dirname, "/public/notes.html"))
});

// Need the get * route to return the index.html file.  THIS SHOULD BE LAST
app.get('*', (req, res) => {
    console.info(`${req.method} request received for the /index route`);
    // the response should be to send the index.html to the client
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

// Need to have the app lsitening at the specified port
app.listen(PORT, () => 
console.log(`App listening at http://localhost:${PORT} 😎`)
);