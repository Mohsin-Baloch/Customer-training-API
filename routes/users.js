const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("./../models/users");
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

router
    .route("/")
    .get(async (req, res) => {
        const users = await User.find();

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: users.length,
            users
        });
    })
    .post(async (req, res) => {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User already registered.");

        user = new User(_.pick(req.body, ["name", "email", "password", "role"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        res
            .header("x-auth-token", token)
            .send(_.pick(user, ["_id", "name", "email", "role"]));
    });

router
    .route("/me")
    .get(auth, async (req, res) => {
        const user = await User.findById(req.user._id).select("-password");
        const token = user.generateAuthToken();
        res.status(200).send({
            status: "success",
            token,
            user
        });
    });

module.exports = router;