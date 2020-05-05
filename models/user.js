const mongoose =  require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
        type: String,
        required: true
      },
    friends: {
        type: Array
    },
    requests: {
        type: Array
    }
  }
);

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}
const User = mongoose.model('User', userSchema);
 
module.exports = User;