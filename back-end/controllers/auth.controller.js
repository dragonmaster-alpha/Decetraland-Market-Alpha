// import { Router } from 'express';
import bcrypt from 'bcryptjs';
import config from '../config';
import jwt from 'jsonwebtoken';
import User from '../models/user.model'
const nodemailer = require('../config/nodemailer.config');

const { JWT_SECRET } = config;

exports.login =  async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
      // Check for existing user
      const user = await User.findOne({ username });
      if (!user) throw Error('User does not exist');

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw Error('Invalid password');

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
      if (!token) throw Error('Couldnt sign the token');

      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          team_id : user.team_id,
          mana: user.mana
        }
      });

    } catch (e) {
      res.status(400).json({ message: e.message });
    }
};

exports.register =  async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {

      const userByName = await User.findOne({ username });
      if (userByName) throw Error('User name already exists');

      const userByEmail = await User.findOne({ email });
      if (userByEmail) throw Error('User Email already exists');

      const salt = await bcrypt.genSalt(10);
      if (!salt) throw Error('Something went wrong with bcrypt');

      const hash = await bcrypt.hash(password, salt);
      if (!hash) throw Error('Something went wrong hashing the password');

      const tkn = jwt.sign({email: email}, JWT_SECRET);

      const datenow = Date.now().toString();
      const team_id = 'wa-' + datenow;

      const newUser = new User({
        username,
        email,
        password: hash,
        team_id,
        confirmationCode: tkn
      });

      newUser.save((err) => {
        if (err) {
          res.status(500).send({ error: err });
               return;
        }
        res.send({
            message: "User was registered successfully! Please check your email",
        });
        nodemailer.sendConfirmationEmail(
          newUser.username,
          newUser.email,
          newUser.confirmationCode
        );
      });
      // if (!savedUser) throw Error('Something went wrong saving the user');

      // const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      //   expiresIn: 3600
      // });

      // res.status(200).json({
      //   token,
      //   user: {
      //     id: savedUser._id,
      //     username: savedUser.username,
      //     email: savedUser.email
      //   }
      // });

    } catch (e) {
      res.status(400).json({ error: e.message });
    }
};

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

exports.getPassword =  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User Does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.verifyUser = (req, res, next) => {
  console.log(req.params.confirmationCode)
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Invalide confirmation code." });
      }

      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        res.send({
          message: "Account activation successful!"
        })
      });
    })
    .catch((e) => console.log("error", e));
};