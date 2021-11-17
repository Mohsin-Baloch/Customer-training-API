const winston = require('winston');
const morgan = require('morgan');
const multer = require('multer');
const upload = multer();
const express = require('express');
const config = require('config');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-requested-with, Content-Type, Access, Authorization"
    );
    if (req.method === "OPTIONS") {
        req.header("Access-Control-Allow-Methods", "PUT, PATCH, DELETE, GET, POST");
        return req.status(200).json({});
    }
    next();
});

require('./startup/logging')();
// app.use(upload.array());
require("./startup/routes")(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 1122;
app.listen(port, () => {
    winston.info(`App listening on port ${port}...`);
})