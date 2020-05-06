const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const proxy = require('http-proxy-middleware')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const userRouter = require('./routes/user.js');
const messageRouter = require('./routes/message.js');
app.use('/user', userRouter);
app.use('/message', messageRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = function(app) {
  // add other server routes to path array
  app.use(proxy(['/api' ], { target: `http://localhost:${port}` }));
}