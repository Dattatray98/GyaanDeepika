const { model } = require("mongoose");
const StudyHub = require("../models/StudyHub");


const GetStudyMatterial = async (req, res) => {
    try{
        const resources = await StudyHub.find();
        res.status(200).json(resources);
    }
    catch{
        res.status(500).json({error: err.message});
    }
}

module.exports = {
    GetStudyMatterial
}