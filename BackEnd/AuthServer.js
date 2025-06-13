import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken"
dotenv.config()

const app = express();
const PORT = 5000;

app.use(express.json())

const posts = [
    {
        username: "kyle",
        title: "post 1"
    },
    {
        username: "datta",
        title: "post 2"
    }
]

app.post('/sign', (req, res)=>{
    //authenticate user
    const username = req.body.username
    const user = {name: username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken})
})


function authenticateToken(req, res, next){
    const authHeader = req.headers["authorization"]
    const token = authHeader&& authHeader.split(" ")[1]
    if (token==null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(PORT, () => console.log("server started"))