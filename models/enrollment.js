const mongoose = require('mongoose');
const Joi = require('joi');


const enrollmentSectionSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    videoProgress: {
        type: Number,
        min: 0,
        default: 0
    },
    isSectionDone: {
        type: Boolean,
        default: false
    },
    isVideoDone: {
        type: Boolean,
        default: false
    },
    MCQProgress: {
        studentChoice: {
            type: String
        },
        isCorrect: {
            type: Boolean,
            default: false
        },
        isDone: {
            type: Boolean,
            default: false
        }
    },
    isLocked: {
        type: Boolean,
        default: true
    }
});

const enrollmentSchema = new mongoose.Schema({
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
    sections: {
        type: [enrollmentSectionSchema]
    },
    assessment: {
        userScore: {
            type: Number,
            default: 0
        },
        userAttempts: {
            type: Number,
            default: 0
        },
        hasPassed: {
            type: Boolean,
            default: false
        }
    },
    hasTrainingPassed: {
        type: Boolean,
        default: false
    }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

function validateEnrollment(enrollment) {
    const schema = Joi.object({
        student: Joi.objectId().required(),
        training: Joi.objectId().required()
    });

    return schema.validate(enrollment);
}

exports.Enrollment = Enrollment;
exports.validateEnrollment = validateEnrollment;