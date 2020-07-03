const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');

//used for session cookie
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//for post requests
app.use(express.urlencoded());


//setting up cookie parser
app.use(cookieParser());


//use static files.. css and js

app.use(express.static("./assets"));
app.use(expressLayouts);

//extract styles and css from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//set up view engine 
app.set('view engine' , 'ejs');
app.set('views' , './views');


app.use(session({
    name: 'codeial',
    //todo, change the secret before deployment
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*100,
    }
}))


app.use(passport.initialize());
app.use(passport.session());


//use express router
app.use('/', require('./routes'))


app.listen(port, (err) => {
    if(err)
        console.log(`Error in firing up server, ${err}`);
    else   
        console.log(`Server running and up at port ${port}`);
})  

