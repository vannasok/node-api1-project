// implement your API here
const express = require('express');
const db = require('./data/db');
const server = express();

//parse json from body
server.use(express.json());

//test the localhost port 5000 ###############################
server.get('/', (req, res) => {
   res.send('test test');
});

// get request ####################################
server.get('/api/users', (req, res) => {
   db.find()
      .then(users => {
         res.status(200).json(users); //200 = good
      })
      .catch(err => {
         console.log('get request error', err);
         res.status(500).json({
            error: 'The users info could not be retrieved.'
         });
      });
});

// post request ###################################
server.post('/api/users', (req, res) => {
   console.log(' post request: req.body', req.body);
   const { name, bio } = req.body;
   if (!name || !bio) {
      res.status(400).json({ error: 'please provide name and bio for user.' });
   } else {
      db.insert({ name, bio })
         .then(({ id }) => {
            db.findById(id)
               .then(user => {
                  res.status(201).json(user);
               }) //then findById
               .catch(err => {
                  console.log('post/insert/findById error', err);
                  res.status(500).json({
                     error: 'Users info could not be retrieved.'
                  });
               });
         }) //then insert
         .catch(err => {
            console.log('post/insert err', err);
            res.status(500).json({
               error: 'there was error saving user info to database.'
            });
         });
   }
});

// get request with ID ###########################
server.get('/api/users/:id', (req, res) => {
   const { id } = req.params;
   db.findById(id)
      .then(user => {
         console.log('user', user);
         if (user) {
            res.status(200).json(user);
         } else {
            res.status(404).json({ error: 'user with ?id does not exist.' });
         }
      }) //close then
      .catch(err => {
         console.log('get/by id err', err);
         res.status(500).json({ error: 'Users info could not be retrieved.' });
      }); //close catch
});

// delete request ###############################
server.delete('/api/users/:id', (req, res) => {
   const { id } = req.params;
   db.remove(id)
      .then(deleted => {
         console.log(deleted);
         if (deleted) {
            res.status(204).json(deleted);
         } else {
            res.status(404).json({
               error: 'user with ?id does not exist.'
            });
         }
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({ error: 'user could not be removed' });
      });
});

// put request ##################################
server.put('/api/users/:id', (req, res) => {
   const { id } = req.params;
   const { name, bio } = req.body;
   if (!name && !bio) {
      return res
         .status(400)
         .json({ error: 'Please provide name and bio for the user.' });
   }
   db.update(id, { name, bio })
      .then(updated => {
         if (updated) {
            db.findById(id)
               .then(user => res.status(200).json(user))
               .catch(err => {
                  console.log(err);
                  res.status(500).json({
                     error: 'The user info could not be retrieved.'
                  });
               });
         } else {
            res.status(404).json({
               error: 'user with ?id does not exist.'
            });
         }
      }) //close then
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: 'The user information could not be modified.'
         });
      }); //close catch
});

// port listen ####################################
const port = 5000;
server.listen(port, () => {
   console.log('API RUNNING......');
});
