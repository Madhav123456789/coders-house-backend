const route = require("express").Router();
const UserController = require('../controllers/user-controller');
const middleware = require('../middlewares/verifyUser');

// send otp for register
route.post("/" , UserController.sendOtp);
// create user after otp verification
route.post("/create" , UserController.verifyOtp);
// activate account
route.post("/activate" , middleware , UserController.activate);
// logut user
route.get("/logout" , middleware , UserController.getLoggedOut);
// refresh token
route.get("/refresh" , UserController.getRefressAuth);

module.exports = route;