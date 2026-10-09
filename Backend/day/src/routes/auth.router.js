const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const authRouter = express.Router(); // ak router hai

authRouter.post("/register", async (req, res) => {
  const { email, name, password } = req.body;

  //email ko cheak out karna same email not exit
  const isUserAlreadyExixts = await userModel.findOne({ email });
  if (isUserAlreadyExixts) {
    return res.status(400).json({
      message: "User already exists with this email address",
    });
  }

  const user = await userModel.create({
    email,
    password,
    name,
  });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  res.status(201).json({
    message: "user registered",
    user,
    token,
  });
});

module.exports = authRouter;
