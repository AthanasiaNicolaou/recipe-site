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

app.use(express.urlencoded({ extended: true}));
/*What this does: your form sends data in a format called "urlencoded" 
(the standard format for regular HTML forms). 
This line tells Express "expect that format, and make the values available to me on req.body." 
Without this line, req.body would be undefined and you couldn't read what the user typed.*/

app.post('/recipes', (req,res) => {
    const {title, ingredients, instrustions, time_needed} = req.body; //req.body is an object holding whatever the user typed (thanks to that urlencoded line), with keys matching each input's name attribute from the form.

    const stmt = db.prepare(`
        INSERT INTO recipes (title, ingredients, instructions, time_needed)
        VALUE (?, ?, ?, ?)`
    );
    stmt.run(title, ingredients, instructions, time_needed);

    res.redirect(`/`); //after saving, send the user's browser to the homepage instead of leaving them on the form
});