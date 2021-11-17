const mongoose = require('mongoose');
const Joi = require('joi');

const MCQSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Please provide a question."],
    },
    options: {
        type: [String],
        required: [true, "please provide 4 Choices for answer"]
    },
    answer: {
        type: String,
        // enum: {
        //     values: [function () {
        //         console.log("return", this.options);
        //         return this.options;
        //     }],
        //     message: "A correct answer must belong to the options provided."
        // },
        required: [true, 'An answer must be specified.']
    }
});

const trainingSectionSchema = new mongoose.Schema({
    sectionNumber: {
        type: Number,
        required: [true, 'Please specify section number.']
    },
    sectionName: {
        type: String,
        // required: [true, "Section name must be specified."]
    },
    sectionType: {
        type: String,
        required: [true, 'Please specify the section type.'],
        enum: {
            values: ['Tutorial', 'Assignment'],
            message: 'Section Type can either be Tutorial or Assignemnt.'
        },
    },
    sectionVideo: {
        path: {
            type: String,
            required: [function () {
                return this.sectionType === 'Tutorial';
            }, "Tutorial material must be specified."]
        },
        title: {
            type: String,
            required: [function () {
                return this.sectionVideo.path ? true : false; //!== null || undefined || "";
            }, "Video title must be specified."]
        }
    },
    infoGraphic: {
        path: {
            type: String
        },
        title: {
            type: String
        }
    },
    sectionPdf: {
        path: {
            type: String,
            // required: [function () {
            //     return this.sectionType === 'Assignment';
            // }, "Assignment material must be specified."]
        },
        title: {
            type: String,
            required: [function () {
                return this.sectionPdf.path ? true : false;//!== null || undefined || "";
            }, "Assignment title must be specified."]
        }
    },
    sectionMCQ: {
        type: MCQSchema
    },
    sectionWorth: {
        type: Number,
        required: [true, 'Please Provide Section Worth for the progress of Training.']
    }
});

const trainingSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Training Code is required.'],
        minlength: 5,
        maxlength: 90,
        unique: [true, "Training Code must be Unique."]
    },
    product: {
        type: String,
        required: [true, 'Product Name is required.'],
        minlength: 5,
        maxlength: 255,
        //unique: true
    },
    sections: {
        type: [trainingSectionSchema]
    },
    assessment: {
        type: [MCQSchema]
    },
    isFinalized: {
        type: Boolean,
        default: false
    }
});

const Training = mongoose.model("Training", trainingSchema);


function validateTrainingSection(section) {
    const schema = Joi.object({
        sectionNumber: Joi.number()
            .required(),
        sectionName: Joi.string()
            .required(),
        sectionType: Joi.string()
            .valid('Tutorial', 'Assignment')
            .required(),
        sectionVideo: Joi.alternatives().conditional('sectionType', {
            is: 'Tutorial', then: Joi.object({
                // path: Joi.alternatives().conditional('sectionType', {
                //     is: 'Tutorial', then: Joi.string()
                //         .required(), otherwise: Joi.string().allow(null, '')
                // }),
                title: Joi.string()
                    .required()
            })
            , otherwise: Joi.allow(null, '')
        }),
        infoGraphic: Joi.object({
            path: Joi.string().allow(null, ''),
            title: Joi.string().allow(null, '')
        }),
        sectionPdf: Joi.alternatives().conditional('sectionType', {
            is: 'Assignment', then: Joi.object({
                // path: Joi.alternatives().conditional('sectionType', {
                //     is: 'Assignment', then: Joi.string()
                //         .required(), otherwise: Joi.string().allow(null, '')
                // }),
                // path: Joi.string().allow(null, ''),
                title: Joi.string()
                    .required()
            })
            , otherwise: Joi.allow(null, '')
        }),
        sectionMCQ: Joi.object({
            question: Joi.string()
                .required(),
            options: Joi.array().items(Joi.string()).length(4)
                .required(),
            answer: Joi.string()
                .required().valid(...section.sectionMCQ.options)
        }),
        sectionWorth: Joi.number()
            .required()
            .min(1)
            .max(100)
    });

    return schema.validate(section);
}

function validateMCQ(MCQ) {
    const schema = Joi.object({
        question: Joi.string()
            .required(),
        options: Joi.array().items(Joi.string()).length(4)
            .required(),
        answer: Joi.string()
            .required()
    });

    return schema.validate(MCQ);
}

function validateTraining(training) {
    const schema = Joi.object({
        code: Joi.string()
            .required(),
        product: Joi.string()
            .required(),
        isFinalized: Joi.boolean()
    });

    return schema.validate(training);
}

exports.Training = Training;
exports.validateMCQ = validateMCQ;
exports.validateTrainingSection = validateTrainingSection;
exports.validateTraining = validateTraining;