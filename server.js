//dependencies:
var express = require("express");
var path = require("path");
var fs = require("fs");
var notes;

//set up express app:
var app = express();
var PORT = process.env.PORT || 3000;

//set up express app to handle data parsing:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

//import db.json


//api routes:
app.get("/api/notes", function(req, res){

    fs.readFile("db/db.json", "utf8", function(error, data) {

        if (error) return console.log(error);

        data = JSON.parse(data)
        res.json(data)
    });
})

var savedNotes = fs.readFileSync("./db/db.json", "UTF-8");
if (savedNotes) {
    var oldNotes = JSON.parse(savedNotes);
    notes = oldNotes;
} else {
    notes = [];
}

//basic routes:
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/api/notes", function(req, res) {
    return res.json(notes);
  });

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    console.log(newNote);
    notes.push(newNote);
    res.json(newNote);
    assignID();
    fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, 2), function (err) {
        if (err) 
            throw err
    });
});


//function to delete notes
app.delete("/api/notes/:id", function (req, res) {
    console.log(req.params.id);
    var deleteID = req.params.id;
    notes.splice(deleteID, 1);
    assignID();
    fs.writeFileSync("./db/db.json", JSON.stringify(notes), function (err) {
        if (err) 
            throw err
    });
});

function assignID() {
    for (i = 0; i < notes.length; i ++) {
        notes[i].id = i;
    }
}
//starts server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });