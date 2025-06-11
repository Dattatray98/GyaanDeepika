import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const PORT = 3000;

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) =>{
    return res.send("server started and this message from backend")
})


app.post('/', (req, res) => {
    console.log(req.body)
    res.send("hello world!")
})


app.listen(PORT, ()=>{
    console.log(`server started at http://localhost:${PORT}`)
})