const mongoose =  require('mongoose');

const session = new mongoose.Schema(
  {
      userId: {
          type: String
      },
      timestamp: {
          type: Date,
          default: Date.now()
      },
      active: {
          type: Boolean,
          default: true
      }
  }
);

const Session = mongoose.model('Session', session);
 
module.exports = Session;