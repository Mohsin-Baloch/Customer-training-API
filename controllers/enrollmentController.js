const _ = require("lodash");
const {
    Enrollment,
    validateEnrollment
} = require("../models/enrollment");
const { Training } = require('../models/trainings');

const getCurrenetUserEnrollments = async (req, res) => {
    let enrollments = await Enrollment.find({
        student: req.user._id
    })
        .populate("training", "code product");

    if (!enrollments) return res.status(404).send("No training could be found with given User ID.");

    res.status(200).json({
        status: "success",
        enrollments
    });
};

const createEnrollment = async (req, res) => {
    const { error } = validateEnrollment(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const training = await Training.findById(req.body.training);
    if (!training) return res.status(404).send("No training could be found with given ID.");

    let enrollment = await Enrollment
        .findOne({ student: req.body.student, training: req.body.training });
    if (enrollment) return res.status(409).send("User already enroled for specified training.");

    enrollment = new Enrollment(_.pick(req.body, ["student", "training"]));
    for (let i = 0; i < training.sections.length; i++) {
        if (i === 0) {
            enrollment.sections.push({
                sectionId: training.sections[i]._id,
                isLocked: false
            });
        }
        else {
            enrollment.sections.push({
                sectionId: training.sections[i]._id
            });
        }
    }
    enrollment = await enrollment.save();

    res.status(200).json({
        status: 'success',
        meassage: "Training enrollment created.",
        enrollment
    });
};

const updateEnrollmentSection = async (req, res) => {
    let enrollment = await Enrollment
        .findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).send("No training enrollment could be found with given ID.");

    let section = enrollment.sections.id(req.body.sectionId);
    section.set(req.body.section);
    enrollment = await enrollment.save();
    section = enrollment.sections.id(req.body.sectionId);
    res.status(200).json({
        status: 'success',
        meassage: "Training enrollment updated.",
        enrollment,
        section
    });
}

const updateEnrollmentProgress = async (req, res) => {
    let enrollment = await Enrollment
        .findById(req.params.enrollmentId);
    if (!enrollment) return res.status(404).send("No training enrollment could be found with given ID.");

    enrollment = _.pick(req.bod, ["assessment", "hasTrainingPassed"]);
    enrollment = await enrollment.save();
    res.status(200).json({
        status: 'success',
        meassage: "Training enrollment updated.",
        enrollment
    });
};

exports.getCurrenetUserEnrollments = getCurrenetUserEnrollments;
exports.createEnrollment = createEnrollment;
exports.updateEnrollmentSection = updateEnrollmentSection;
exports.updateEnrollmentProgress = updateEnrollmentProgress;