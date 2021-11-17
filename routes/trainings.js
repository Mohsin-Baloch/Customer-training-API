const {
    getAllTrainings,
    createTraining,
    updateTraining,
    isUpdateReqValid,
    getSingleTraining,
    finalizeTraining
} = require('../controllers/trainingController');
const { upload } = require('../utils/uploadHandler');
const express = require("express");
const router = express.Router();


router
    .route("/")
    .get(getAllTrainings)
    .post(createTraining);

router
    .route("/:id")
    .get(getSingleTraining)
    .patch(
        upload.fields([
            {
                name: 'video',
                maxCount: 1
            },
            {
                name: 'assignment',
                maxCount: 1
            },
            {
                name: 'image',
                maxCount: 1
            }
        ]),
        isUpdateReqValid,
        updateTraining);

router
    .route("/:id/markFinal")
    .patch(finalizeTraining)


module.exports = router;