const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_dev');


const db = mongoose.connection;

db.on('error' , console.error.bind(console , 'Error connecting to db'));

db.once('open' , () => {
    console.log('Connected to DB :: MongoDB');
    
})

module.exports = db;