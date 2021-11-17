const express = require("express");
const router = express.Router();
const {
    createAssignment,
    getAssignments,
    updateAssignemnt,
    updateAssignmentDoc
} = require('../controllers/assignmentController');
const auth = require('../middleware/auth');

const { upload } = require('../utils/uploadHandler');

router
    .route("/")
    .get(auth, getAssignments)
    .post(upload.fields([
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
        createAssignment);

router
    .route("/:id")
    .patch(updateAssignemnt);

router
    .route("/:id/updateDoc")
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
        updateAssignmentDoc
    );

module.exports = router;