const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user_controller');
const passport = require('passport');

router.get('/profile/:id', passport.checkAuthentication, usersController.profile);


router.get('/sign-up', usersController.signUp);
router.get('/sign-in', usersController.signIn);
router.get('/sign-out', usersController.destroySession);
router.get('/update-profile/:id', usersController.updateProfile);
router.post('/update-details/:id', usersController.updateDetails)
router.post('/create', usersController.create);

//use passport as middleware to authenticate
router.post('/create-session', passport.authenticate('local' , 
    {failureRedirect: '/users/sign-in'},) 
    ,usersController.createSession);

router.get('/auth/google' , passport.authenticate('google' , {scope: ['profile', 'email']}));
router.get('/auth/google/callback' , passport.authenticate('google' , {failureRedirect: '/users/sign-in'}), usersController.createSession)
     
module.exports = router;