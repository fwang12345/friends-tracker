const router = require('express').Router();
const User = require('../models/user');

router.route('/find').post((req, res) => {
  const { username } = req.body;
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else if (user) {
      return res.send({
        success: true,
        user: user
      })
    } else {
      return res.send({
        success: false,
        message: 'Error: User does not exist'
      })
    }
  })
});
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
        return res.send({
          success: true,
          message: 'Successfully logged in',
          username: user.username
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

router.route('/search').post((req, res) => {
  const { username, token } = req.body;
  User.find({
    username: {$regex: new RegExp('^.*'+username+'.*', 'i'), $ne: token}
  }, (err, users) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      return res.send({
        success: true,
        message: 'Search successful',
        users: users
      })
    }
  })
})

router.route('/request').post((req, res) => {
  const { username, token } = req.body;
  User.findOneAndUpdate({
    username: username
  }, {
    $addToSet: {requests: token}
  }, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      return res.send({
        success: true,
        message: 'Request Sent'
      })
    }
  })
})

router.route('/accept').post((req, res) => {
  const { username, token } = req.body;
  User.findOneAndUpdate({
    username: token
  }, {
    $pull: {requests: username},
    $addToSet: {friends: username}
  }, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      User.findOneAndUpdate({
        username: username
      }, {
        $addToSet: {friends: token}
      }, (err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          })
        } else {
          return res.send({
            success: true,
            message: 'Successfully accepted request'
          })
        }
      })
    }
  })
})

router.route('/reject').post((req, res) => {
  const { username, token } = req.body;
  User.findOneAndUpdate({
    username: token
  }, {
    $pull: {requests: username}
  }, (err, user) => {
    if (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      })
    } else {
      return res.send({
        success: true,
        message: 'Successfully rejected request'
      })
    }
  })
})

module.exports = router;