const fs = require("fs");
const _ = require("lodash");
const {
    Training, validateMCQ,
    validateTraining, validateTrainingSection
} = require('../models/trainings');



const getAllTrainings = async (req, res) => {
    const trainings = await Training.find().select("-sections -assessment");

    res.status(200).json({
        status: 'success',
        results: trainings.length,
        trainings
    });
};

const getSingleTraining = async (req, res) => {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).send("No training could be found with given ID.");

    res.status(200).json({
        status: "success",
        training
    });
}

const createTraining = async (req, res) => {
    const { error } = validateTraining(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let training = await Training.findOne({ code: req.body.code });
    if (training) return res.status(409).send("Training with the code given already exists.");
    training = new Training(_.pick(req.body, ["code", "product", "isFinalized"]));
    training = await training.save();

    res.status(200).json({
        status: 'success',
        meassage: "Training created.",
        training
    });
};

const isUpdateReqValid = async (req, res, next) => {
    let training = await Training.findById(req.params.id);
    const {
        image,
        video,
        assignment
    } = req.files;
    if (!training) {
        if (image) fs.unlinkSync(image[0].path);
        if (video) fs.unlinkSync(video[0].path);
        if (assignment) fs.unlinkSync(assignment[0].path);
        return res.status(404).send("No training could be found with given ID.");
    }
    if (training.isFinalized) {
        if (image) fs.unlinkSync(image[0].path);
        if (video) fs.unlinkSync(video[0].path);
        if (assignment) fs.unlinkSync(assignment[0].path);
        return res.status(409).send("Training is already marked final, cannot update.");
    }
    const {
        section,
        assessment
    } = JSON.parse(req.body.document);

    if (section) {
        for (let i = 0; i < training.sections.length; i++) {
            if (section.sectionNumber === training.sections[i].sectionNumber) {
                if (image) fs.unlinkSync(image[0].path);
                if (video) fs.unlinkSync(video[0].path);
                if (assignment) fs.unlinkSync(assignment[0].path);
                return res.status(409).send("A Training Section with the Section Number given already exists.");
            }
        }
        const { error } = validateTrainingSection(section) || section.sectionMCQ && validateMCQ(section.sectionMCQ);
        if (error) {
            if (image) fs.unlinkSync(image[0].path);
            if (video) fs.unlinkSync(video[0].path);
            if (assignment) fs.unlinkSync(assignment[0].path);
            return res.status(400).send(error.details[0].message);
        }
    }

    if (assessment) {
        const err = validateMCQ(assessment).error;
        if (err) return res.status(400).send(err.details[0].message);
    }
    next();
};

const updateTraining = async (req, res) => {
    let training = await Training.findById(req.params.id);
    const {
        image,
        video,
        assignment
    } = req.files;
    const {
        section,
        assessment
    } = JSON.parse(req.body.document);//req.body;
    if (section) {
        if (image) {
            section.infoGraphic.path = image[0].path;
        }
        if (video) {
            section.sectionVideo.path = video[0].path;
        }
        if (assignment) {
            section.sectionPdf.path = assignment[0].path;
        }
        // console.log("section-is", section);
        training.sections.push({ ...section });
    }

    if (assessment) {
        training.assessment.push(assessment);
    }

    if (section || assessment) {
        training = await training.save();
        return res.status(200).json({
            status: 'success',
            meassage: "Training Updated.",
            training
        });
    }
    res.status(405).json({
        status: 'Method Not Allowed',
        meassage: "Nothing to update.",
        training
    });
};

const finalizeTraining = async (req, res) => {
    let training = await Training.findById(req.params.id);
    if (!training) {
        return res.status(404).send("No training could be found with given ID.");
    }
    if (training.isFinalized) {
        return res.status(409).send("Training is already marked final, cannot update.");
    }
    training.isFinalized = true;

    training = await training.save();
    return res.status(200).json({
        status: 'success',
        meassage: "Training Updated.",
        training
    });
};

exports.updateTraining = updateTraining;
exports.finalizeTraining = finalizeTraining;
exports.createTraining = createTraining;
exports.getAllTrainings = getAllTrainings;
exports.getSingleTraining = getSingleTraining;
exports.isUpdateReqValid = isUpdateReqValid;