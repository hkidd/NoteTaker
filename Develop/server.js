// Required dependencies
const express = require("express");
const db = require("./db/db.json");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const uuid = require("../helpers/uuid");

// Initialize express application
const app = express();

// Middleware for parsing application/json and url data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Client facing files are in a "public" folder, so the static method can be used
app.use(express.static("public"));

// We have GET, POST, and DELETE methods in the index.js for the '/api/notes' route
// GET route
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} request received for the api/notes route`);
  // this route should read the db.json file and return all saved notes as json
  res.json(db);
});

// POST route
app.post("/api/notes", (req, res) => {
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
    err
      ? console.error(err)
      : console.log(`New Note has been written to JSON db`)
  );
  // Pass along the new db as a response
  res.send(db);
});

// DELETE route needs the specific note id to delete the correct one
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received for the api/notes route`);

  // using the id parameter, create a noteId variable
  let noteId = req.params.id;
  console.log(noteId);

  // loop through the entire note database, and find the one note with a matching id
  for (let i = 0; i < db.length; i++) {
    const currentNote = db[i];

    if (currentNote.id === noteId) {
      // splice out one element starting at that noteId (only that note)
      db.splice(i, 1);
      res.json(`Note has been deleted`);
      console.log(db);

      // after splicing out the note, write a new file with the updated db array
      fs.writeFile("./db/db.json", JSON.stringify(db), (err) =>
        err ? console.log(err) : console.log("Success!")
      );

      return;
    }
  }

  // Pass along the new db as a response
  res.send(db);
});

// Need the get /notes route to return the notes.html file
app.get("/notes", (req, res) => {
  console.info(`${req.method} request received for the /notes route`);
  // the response should be to send the notes.html to the client
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Need the get * route to return the index.html file.  THIS SHOULD BE LAST
app.get("*", (req, res) => {
  console.info(`${req.method} request received for the /index route`);
  // the response should be to send the index.html to the client
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Need to have the app lsitening at the specified port
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 😎`)
);
