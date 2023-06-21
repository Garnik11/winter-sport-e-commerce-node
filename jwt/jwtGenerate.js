const jwt = require('jsonwebtoken');
require('dotenv').config()
const SECRET = process.env.SECRET

function generateAccessToken(email,role) {

    return jwt.sign({email,role}, SECRET, { expiresIn: '86400s' });
}


module.exports={generateAccessToken}