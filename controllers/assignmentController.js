const { assign } = require("lodash");
const _ = require("lodash");
const {
    Assignment,
    validateAssignment
} = require("../models/assignments");


const createAssignment = async (req, res) => {
    const data = JSON.parse(req.body.document)
    const { error } = validateAssignment(data);
    if (error) return res.status(400).send(error.details[0].message);
    let assignment = await Assignment.findOne({ sectionId: data.sectionId });

    if (assignment) return res.status(409).send("An assignment document is already submitted.");
    assignment = new Assignment(_.pick(data, ["sectionId", "student", "training"]));
    const assignmentFile = req.files.assignment[0].path;
    const fileTitle = req.files.assignment[0].fileName;
    assignment.userDocs.push({
        path: assignmentFile,
        title: fileTitle || ""
    });
    assignment.status = "Pending";
    assignment = await assignment.save();

    res.status(200).json({
        status: 'success',
        meassage: "Assignment Document Submitted.",
        assignment
    });
}

const getAssignments = async (req, res) => {
    let assignments = [];
    if (req.user.role === "Admin") {
        assignments = await Assignment.find()
            .populate("training", "code product")
            .populate("student", "name");
    }
    else {
        assignments = await Assignment
            .find({
                student: req.user._id
            })
            .populate("training", "code product")
            .populate("student", "name");
    }
    res.status(200).json({
        status: "success",
        assignments
    });
}

const updateAssignemnt = async (req, res) => {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).send("No training enrollment could be found with given ID.");
    if (req.body.comment) {
        assignment.comments.push(req.body.comment);
    }
    assignment.status = req.body.status;
    assignment = await assignment.save();
    res.status(200).json({
        status: 'success',
        meassage: "Assignment Updated.",
        assignment
    });
}

const updateAssignmentDoc = async (req, res) => {
    let assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).send("No training enrollment could be found with given ID.");
    const assignmentFile = req.files.assignment[0].path;
    const fileTitle = req.files.assignment[0].fileName;
    assignment.userDocs.push({
        path: assignmentFile,
        title: fileTitle || ""
    });
    assignment.status = "Pending";
    assignment = await assignment.save();

    res.status(200).json({
        status: 'success',
        meassage: "Assignment Updated.",
        assignment
    });
}

exports.createAssignment = createAssignment;
exports.getAssignments = getAssignments;
exports.updateAssignemnt = updateAssignemnt;
exports.updateAssignmentDoc = updateAssignmentDoc;