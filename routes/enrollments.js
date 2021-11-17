const express = require("express");
const router = express.Router();
const {
    createEnrollment,
    getCurrenetUserEnrollments,
    updateEnrollmentSection,
    updateEnrollmentProgress
} = require('../controllers/enrollmentController');
const auth = require('../middleware/auth');

router
    .route("/myEnrollments")
    .get(auth, getCurrenetUserEnrollments);

router
    .route("/")
    .post(createEnrollment);

router
    .route("/:enrollmentId")
    .patch(updateEnrollmentProgress);

router
    .route("/:enrollmentId/updateSection")
    .patch(updateEnrollmentSection);

module.exports = router;