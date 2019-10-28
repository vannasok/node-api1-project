// implement your API here
const express = require('express');
const db = require('./data/db');
const server = express();

//parse json from body
server.use(express.json());

//test the localhost port 5000
server.get('/', (req, res) => {
   res.send('test test');
});

// get request
server.get('/api/users', (req, res) => {
   db.find()
      .then(users => {
         res.status(200).json(users);
      })
      .catch(err => {
         console.log('get request error', err);
         res.status(500).json({
            error: 'The users info could not be retrieved.'
         });
      });
});

// port listen
const port = 5000;
server.listen(port, () => {
   console.log('API RUNNING......');
});
