const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');


//defining transporter
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'krishna.test16@gmail.com',
        pass: 'asdfghjkl@123456789'
    }

})

let renderTemplate = (data , relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        (err,template) => {
            if(err){
                console.log('error in rendering template');
                return;
            }

            mailHTML = template;
        }
    )

    return mailHTML;
}


module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}