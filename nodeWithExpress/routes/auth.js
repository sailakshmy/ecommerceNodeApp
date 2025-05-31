const express = require("express");

const { check } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.post(
  "/signup",
  check("email").isEmail().withMessage("Please enter a valid email"),
  authController.postSignup
);

router.get("/signup", authController.getSignup);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
