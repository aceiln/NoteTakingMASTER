require('dotenv').config()

const express = require('express');
const app = express();
const fs = require('fs')

app.use(express.json());
app.use(express.static("public"));

app.listen(process.env.PORT || 1000, () => {
    console.log(`Server is running on port ${process.env.PORT || 1000}`);
})

app.get('/notes', async (req, res) => {
    res.sendFile(__dirname + '/public/notes.html')
})
app.get('/api/notes', async (req, res) => {
    res.sendFile(__dirname + '/db/db.json')
})

app.post('/api/notes', express.raw({ type: 'application/json' }), async (req, res) => {
    let data = JSON.parse(fs.readFileSync(__dirname + '/db/db.json',
        { encoding: 'utf8', flag: 'r' }));

    const noteData = {
        "title": req.body.title || "Unnamed",
        "text": req.body.text || "No text",
        "id": String(Date.now())+"_"+String(Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000)
    }
    data.push(noteData)

    fs.writeFile(__dirname+"/db/db.json", JSON.stringify(data), (err) => {
        if (err)
            console.log(err);
        else {
            res.json(data);
        }
    });
})

app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id

    let data = JSON.parse(fs.readFileSync(__dirname + '/db/db.json',
        { encoding: 'utf8', flag: 'r' }));

    const newData = data.filter(note=> note.id !== id)

    fs.writeFile(__dirname+"/db/db.json", JSON.stringify(newData), (err) => {
        if (err)
            console.log(err);
        else {
            res.json(data);
        }
    });
})

