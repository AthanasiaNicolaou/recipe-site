const db = require('./db/db');
const express = require('express'); //pulls in the Express library
const session = require('express-session');
const app = express(); //creates the "app"
app.set('view engine', 'ejs'); //tells Express "when I ask you to render a page, use EJS to build it, and look for the templates in a views folder"

app.get('/', (req, res) => { //app.get('/', ...) — this says: "when someone visits the homepage (/), run this function." The function takes two things: req (the incoming request — what the visitor asked for) and res (the response — what you send back).
    const recipes = db.prepare('SELECT * FROM recipes').all(); //.all() runs it and returns every matching row as a JavaScript array of objects (one object per recipe, each with .title, .ingredients, etc.)
    res.render('index', { recipes: recipes}); //the second argument to render is how you pass data into the template. This makes a variable called recipes available inside index.ejs
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

app.use(session({
    secret: 'change-this-to-something-random-later', //make stronger later
    resave: false,
    saveUninitialized: false,
}));
/*What this does: this middleware gives every visitor a unique session, tracked via a cookie in their browser. 
Once someone logs in, we'll store their user info inside req.session — and it'll persist across page loads because of this cookie, 
without them needing to log in again on every single request.*/

app.post('/recipes', (req,res) => {
    const {title, ingredients, instructions, time_needed} = req.body; //req.body is an object holding whatever the user typed (thanks to that urlencoded line), with keys matching each input's name attribute from the form.

    const stmt = db.prepare(`
        INSERT INTO recipes (title, ingredients, instructions, time_needed)
        VALUES (?, ?, ?, ?)`
    );
    stmt.run(title, ingredients, instructions, time_needed);

    res.redirect('/'); //after saving, send the user's browser to the homepage instead of leaving them on the form
});

app.get('/recipes/:id', (req, res) => {
    const recipe = db.prepare(`SELECT * FROM recipes WHERE id = ?`).get(req.params.id) //req.params.id — this is how you read that captured value. If someone visits /recipes/3, then req.params.id equals "3"
    res.render('recipe', { recipe: recipe}); //1st recipe:key, 2nd recipe:value
});

app.post('/recipes/:id/delete', (req, res) => {
    db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
    res.redirect('/');
})
