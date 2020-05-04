const router = require('express').Router();
let User = require('../models/user');

router.route('/find/:username/').get((req, res) => {
  User.find({username: req.params.username})
    .then(users => {
      console.log(users)
      res.json(users)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:username/:password').get((req, res) => {
  User.find({username: req.params.username, password: req.params.password})
    .then(users => {
      console.log(users)
      res.json(users)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
  console.log(req.body.username)
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  })

  newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;