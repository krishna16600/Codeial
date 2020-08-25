const queue = require('../config/kue');

const commentsMailer = require('../mailers/comment_mailer');

//making process function to let worker start the job
queue.process('emails' , (job , done) => {
    console.log('emails worker is processing a job...' , job.data);

    commentsMailer.newComment(job.data);

    done();
})