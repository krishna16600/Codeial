const nodemailer = require('../config/nodemailer');

//another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside new comment mailer');
    nodemailer.transporter.sendMail({
        from : 'krishna.test16@gmail.com',
        to: comment.user.email,
        subject: 'New comment published',
        html: ' <h1>Hey, your comment is now published</h1>'
    }, (err , info) => {
        if(err){
            console.log('error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}
