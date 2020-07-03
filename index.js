const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');


//use static files.. css and js

app.use(express.static("./assets"));
app.use(expressLayouts);

//extract styles and css from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//use express router
app.use('/', require('./routes'))

//set up view engine 
app.set('view engine' , 'ejs');
app.set('views' , './views');







app.listen(port, (err) => {
    if(err)
        console.log(`Error in firing up server, ${err}`);
    else   
        console.log(`Server running and up at port ${port}`);
})  

