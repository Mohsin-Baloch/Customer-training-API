const mongoose = require('mongoose');
const Joi = require('joi');


const sectionPdfSchema = new mongoose.Schema({
    path: {
        type: String
    },
    title: {
        type: String
    }
});

const assignmentCommentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    rleativeDoc: {
        type: mongoose.SchemaTypes.ObjectId
    }
})

const assignemntSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.SchemaTypes.ObjectId
    },
    student: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, "Trainee ID must be specified"]
    },
    training: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Training',
        required: [true, "Training ID must be specified"]
    },
    userDocs: {
        type: [sectionPdfSchema]
    },
    comments: {
        type: [assignmentCommentSchema]
    },
    status: {
        type: String,
        default: "None",
        enum: {
            values: ["None", "Pending", "Rejected", "accepted"]
        }
    }
});

const Assignment = mongoose.model("Assignment", assignemntSchema);


function validateAssignment(assignment) {
    const schema = Joi.object({
        sectionId: Joi.objectId(),
        student: Joi.objectId().required(),
        training: Joi.objectId().required()
    });

    return schema.validate(assignment);
}

exports.Assignment = Assignment;
exports.validateAssignment = validateAssignment;