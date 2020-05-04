const router = require('express').Router();
const User = require('../models/user');
const Session = require('../models/session')

router.route('/login').post((req, res) => {
  const {username, password} = req.body;
  User.findOne({ username: username}, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else if (user) {
      if (user.validPassword(password)) {
        const newSession = new Session({
          userId: user._id
        })
        newSession.save((err, ses) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            })
          } else {
            return res.send({
              success: true,
              message: 'Successfully logged in',
              token: ses._id
            })
          }
        })
      } else {
        return res.send({
          success: false,
          message: 'Incorrect password'
        })
      }
    } else {
      return res.send({
        success: false,
        message: 'Error: User does not exist'
      })
    }
    console.log(user)
  })
});

router.route('/signup').post((req, res) => {
  const {username, password} = req.body;
  User.find({ username: username }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else if (users.length) {
      return res.send({
        success: false,
        message: 'Error: Username taken'
      })
    } else {
      var newUser = new User({
        username: req.body.username
      })
      newUser.password = newUser.generateHash(password);
    
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          })
        } else {
          return res.send({
            success: true,
            message: 'Account successfully created'
          })
        }
      })
    }
  });
});

router.route('/verify').post((req, res) => {
  const {token} = req.body;
  Session.findOne({ 
    _id: token,
    active: true
  }, (err, ses) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      return res.send({
        success: true,
        message: 'Successfully verified',
        token: ses._id
      })
    }
  });
});

router.route('/logout').post((req, res) => {
  const {token} = req.body;
  Session.findOneAndUpdate({ 
    _id: token,
    active: true
  }, {
    $set: {active: false}
  }, (err, ses) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      return res.send({
        success: true,
        message: 'Successfully logged out',
        token: ses._id
      })
    }
  });
});

module.exports = router;