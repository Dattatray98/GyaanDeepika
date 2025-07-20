const mongoose = require("mongoose");

const StudyHubSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['notes', 'papers', 'formulas', 'videos'],
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("StudyHub", StudyHubSchema, "studyhubs");
