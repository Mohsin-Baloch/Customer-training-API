const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: 5,
        maxlength: 90
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: [4, "Pasword must be atleast 4 charactors long."],
        maxlength: 255
    },
    role: {
        type: String,
        required: [true, 'User role must be defined!'],
        enum: {
            values: ['Admin', 'Customer'],
            message: 'User role can either be Admin or Customer.'
        }
    }
});


userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
      {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role
      },
      config.get("jwtPrivateKey")
    );
    return token;
  };

const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string()
            .min(2)
            .max(50)
            .required(),
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(255)
            .required(),
        role: Joi.string()
            .required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;