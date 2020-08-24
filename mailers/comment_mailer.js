const nodemailer = require('../config/nodemailer');

//another way of exporting a method
exports.newComment = (comment) => {
    
    let htmlString = nodemailer.renderTemplate({
        comment: comment
    }, '/comments/new_comment.ejs')

    nodemailer.transporter.sendMail({
        from : 'krishna.test16@gmail.com',
        to: comment.user.email,
        subject: 'New comment published',
        html: htmlString
    }, (err , info) => {
        if(err){
            console.log('error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}
