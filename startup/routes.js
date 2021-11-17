const express = require('express');
const users = require('../routes/users');
const trainings = require('../routes/trainings');
const enrollments = require('../routes/enrollments');
const assignments = require('../routes/assignments');
const auth = require('../routes/auth');
const multer = require('multer');
const upload = multer();
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/users', users);
    // app.use(upload.any());
    app.use('/api/trainings', trainings);
    app.use('/api/enrollments', enrollments);
    app.use('/api/assignments', assignments);
    app.use('/api/auth', auth);
    app.use(error);
}