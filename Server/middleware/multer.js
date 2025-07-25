const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename:(req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

const uploaddata = multer({storage});

module.exports = uploaddata;
