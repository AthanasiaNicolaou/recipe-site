const db = require('./db/db');
const express = require('express'); //pulls in the Express library
const session = require('express-session');
const app = express(); //creates the "app"
const bcrypt = require('bcrypt');
app.set('view engine', 'ejs'); //tells Express "when I ask you to render a page, use EJS to build it, and look for the templates in a views folder"

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

app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.currentUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
    } else {
        res.locals.currentUser = null;
    }
    next(); //Calling next() says "I'm done, continue on to whatever's supposed to handle this request next" (either the next middleware, or the actual matching route). If you forget to call next(), the request just hangs forever
});
/*res.locals — a special object where anything you put becomes automatically available inside every EJS template, without you needing to manually pass it via res.render('page', { ... }) each time.*/
/*So altogether: on every request, we check if there's a userId in the session. If yes, look up that user's full info and stash it in res.locals.currentUser. If not, set it to null. Every template can now check currentUser freely.*/

function requireLogin(req, res, next) {
    if (!res.locals.currentUser) {
        return res.redirect('/login');
    }
    next();
}
/*
unlike the currentUser middleware (which runs automatically on every request via app.use), 
this one is written as a named function you'll manually attach to specific routes 
— only the ones that should require login. If currentUser is null (nobody's logged in), 
it redirects to /login and never calls next() — meaning the actual route never runs at all.
*/

app.get('/', (req, res) => { //app.get('/', ...) — this says: "when someone visits the homepage (/), run this function." The function takes two things: req (the incoming request — what the visitor asked for) and res (the response — what you send back).
    const recipes = db.prepare('SELECT * FROM recipes').all(); //.all() runs it and returns every matching row as a JavaScript array of objects (one object per recipe, each with .title, .ingredients, etc.)
    res.render('index', { recipes: recipes}); //the second argument to render is how you pass data into the template. This makes a variable called recipes available inside index.ejs
});

app.get('/recipes/new', requireLogin, (req,res) => {
    res.render('new');
});

app.post('/recipes', requireLogin, (req,res) => {
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

app.post('/recipes/:id/delete', requireLogin, (req, res) => {
    db.prepare('DELETE FROM recipes WHERE id = ?').run(req.params.id);
    res.redirect('/');
})

app.get('/signup', (req, res) => {
    res.render('signup'); //res.render('signup') tells Express: "find views/signup.ejs, turn it into plain HTML, and send that HTML back to whoever made this request."
})

app.post('/signup', async (req, res) => { //Hashing a password with bcrypt isn't instant — it's deliberately slow (a security feature, makes brute-force guessing harder). Because it takes real time, it's an asynchronous operation — JavaScript doesn't freeze and wait for it by default; instead you use async/await to say "pause this specific function here until this finishes, but don't block anything else on the server meanwhile."
    const { username, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10); //await pauses until the hash is ready

    const stmt = db.prepare(`
        INSERT INTO users (username, email, password_hash)
        VALUES (?, ?, ?)
    `);
    stmt.run(username, email, passwordHash);

    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
        return res.send('No account with that email.');
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        return res.send('Incorrect password.');
    }

    req.session.userId = user.id; //By storing user.id here, we're saying "this browser is now associated with this specific user." On every future request from this same browser, req.session.userId will still hold that value — that's how the server "remembers" who's logged in, without them re-entering credentials on every page.
    res.redirect('/');
});

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(3000, () => { //starts the server
    console.log('Server running at http://localhost:3000')
});
