const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const proxy = require('http-proxy-middleware')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://frankiewang:Uw1FzTeVkn5iRgVu@user-irypa.mongodb.net/CIS197?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const userRouter = require('./routes/user.js');
app.use('/user', userRouter);

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
  app.use(proxy(['/api' ], { target: 'http://localhost:5000' }));
}