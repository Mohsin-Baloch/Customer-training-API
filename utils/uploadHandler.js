const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, './uploads/images/')
        }
        else if (file.fieldname === "video") {
            cb(null, './uploads/videos/');
        }
        else if (file.fieldname === "assignment") {
            cb(null, './uploads/assignments/')
        }
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname === "video") {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
        else if (file.fieldname === "assignment") {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }
});

const upload = multer({
    storage: storage,
    limits: (req, file, cb) => {
        if (file.fieldname === "image") {
            return { fileSize: 8000000 };
        }
        else if (file.fieldname === "video") {
            return {};
        }
        else if (file.fieldname === "assignment") {
            return { fileSize: 12000000 };
        }
        else
            return { fileSize: 8000000 };
    },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    if (file.fieldname === "assignment") {
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) { // check file type to be pdf, doc, or docx
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
    else if (file.fieldname === "image") {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            fiel.mimetype === 'image/gif'
        ) { // check file type to be png, jpeg, or jpg
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
    else if (file.fieldname === "video") {
        if (file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
}

exports.upload = upload;

//OLD CODE
/*
const imageStorage = multer.diskStorage({
    // Destination to store image
    destination: 'images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 8000000 // 1000000 Bytes = 1 MB => 8000000 Bytes = 8 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload an Image'))
        }
        cb(undefined, true)
    }
});

const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now()
            + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    // limits: {
    // fileSize: 10000000 // 10000000 Bytes = 10 MB
    // },
    fileFilter(req, file, cb) {
        // upload only mp4 and mkv format
        if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
            return cb(new Error('Please upload a video'))
        }
        cb(undefined, true)
    }
})

exports.imageUpload = imageUpload;
exports.videoUpload = videoUpload;
exports.upload = upload;

*/