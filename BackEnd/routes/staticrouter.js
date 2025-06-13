const express = require("express");
const router = express.Router();

router.get("/signup", (req, res)=>{
    return res.send("hello world")
})

module.exports = router;