const mongoose =  require('mongoose');
 
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
    requested: {
        type: Array
    },
    requests: {
        type: Array
    }
  }
);
 
const User = mongoose.model('User', userSchema);
 
module.exports = User;