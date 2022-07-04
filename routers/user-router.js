const route = require("express").Router();
const UserController = require('../controllers/user-controller');

// send otp for register
route.post("/" , UserController.sendOtp);
// create user after otp verification
route.post("/create" , UserController.verifyOtp);

module.exports = route;