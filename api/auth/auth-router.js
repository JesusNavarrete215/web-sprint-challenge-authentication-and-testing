const router = require('express').Router();
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const restricted = require('../middleware/restricted');
const tokenBuilder = require('./token-builder')
router.post('/register',async (req, res, next) => {

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
      try{
        const { username, password } = req.body
        const hash = bcrypt.hashSync(password, 6) 
        const newUser = {username, password : hash}
        const user = await User.add(newUser)
        // res.status(201).json(user)

        if(!username && !password){
          res.status(401).json({message:'username and password required'})
        } else if(!username) {
          res.status(401).json({message:'username taken'})
        } else{
          res.status(201).json(newUser)
        }

      }catch(err){
        next(err)
      }

});


router.post('/login', (req, res, next) => {
 
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
      let {username, password} = req.body
      User.findBy({username})
      .then(([user]) =>{
        if (user && bcrypt.compare(password, user.password)){
          const token = tokenBuilder(user)
          res.status(200).json({ message: `welcome, ${user.username}`, token})
        } else if(!user && !bcrypt.compare(password, user.password)){
          res.status(401).json({message:'username and password required'})
        } else {
          res.status(401).json({message: 'invalid credentials'})
        }
      })
      .catch(next)

});

module.exports = router;
