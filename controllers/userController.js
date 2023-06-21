const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { generateAccessToken } = require("../jwt/jwtGenerate");
const { sendEmail } = require("../mailer/mailer");
const { validationResult,body } = require('express-validator');
const {User} = require("../models")

const SECRET = process.env.SECRET;
const PORT = process.env.PORT;

const registerValidationRules = [
  body("userName").isLength({ min: 6 })
  .withMessage("UserName must be at least 6 characters long").notEmpty().withMessage("UserName can not be empty"),
  body("email").notEmpty().withMessage('Email is required.').isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    .withMessage("Password must contain at least one uppercase letter, one lowercase letter, and one number"),
];

async function register(req, res) {
  const { userName, email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res
        .status(400)
        .json("A User account with this email already exists");
    } 

      

    const newUser = {
      userName,
      email,
      password: hashed_password,
    };
    User.create(newUser)

      .then((user) => {
      const token = generateAccessToken(email, user.role);
      sendEmail(email, token);
        res.status(201).json(user);

      })
      .catch(() => {
        res.status(500).json({ message: '' });
      });
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}

const loginValidationRules = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  
];

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json("Email is not correct");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword && user.is_verified === 1) {
      const token = generateAccessToken(email, user.role);
      res.send(
        JSON.stringify({
          status: "Logged in",
          jwt: token,
          role: user.role,
          userName: user.userName,
        })
      );
    } else if (!validPassword) {
        return res.status(400).json(" you need verification ");
    } else{
        
        return res.status(400).json("Invalid password ");
    }
  } catch {
    res.status(500).json({ message: "Server Problem" });
  }
}

async function confirm_email(req, res) {
  try {
    const {token} = req.query;
    const decoded = jwt.verify(token, SECRET);
    await User.update({ is_verified: 1 }, { where: { email: decoded.email } });
    res.status(200).json({ message: "Verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login, confirm_email, loginValidationRules, registerValidationRules};
