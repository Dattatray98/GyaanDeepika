const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    qualities: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    durationFormatted: {
        type: String,
        required: true
    },
    views: {
        type: String,
        required: true
    },
    isPublic: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    }
}, { timestamps: true })


const Video = mongoose.model("Video", videoSchema, 'video')
module.exports = Video;