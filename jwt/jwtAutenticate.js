const jwt = require('jsonwebtoken')
require('dotenv').config()
const SECRET = process.env.SECRET


function authenticateTokenAdmin(req, res, next) {
  const token = req.headers.authorization
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, SECRET, (err, user) => {
    console.log(user);
    if (err) {
      return res.sendStatus(403);
    }
    if(token && user.role === 1){
        return next()
    }

  });
}
function authenticateTokenUser(req, res, next) {
    const token = req.headers.authorization
    if (token == null) {
      return res.sendStatus(401);
    }
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      else if(user.role === 0){
          next()
      }
  
    });
  }



module.exports = { authenticateTokenUser, authenticateTokenAdmin };

