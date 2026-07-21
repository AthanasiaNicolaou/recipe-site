const db = require('./db/db');
const express = require('express'); //pulls in the Express library
const app = express(); //creates the "app"
app.set('view engine', 'ejs'); //tells Express "when I ask you to render a page, use EJS to build it, and look for the templates in a views folder"

app.get('/', (req, res) => { //app.get('/', ...) — this says: "when someone visits the homepage (/), run this function." The function takes two things: req (the incoming request — what the visitor asked for) and res (the response — what you send back).
    res.render('index');
});

app.listen(3000, () => { //starts the server
    console.log('Server running at http://localhost:3000')
});

app.get('/recipes/new', (req,res) => {
    res.render('new');
});