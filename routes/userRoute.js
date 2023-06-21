const express = require("express")

const user_router = express.Router()
const user = require("../controllers/userController")

user_router.post("/register", user.registerValidationRules, user.register)
user_router.post("/login", user.loginValidationRules,  user.login)
user_router.get("/verify", user.confirm_email)

module.exports = user_router