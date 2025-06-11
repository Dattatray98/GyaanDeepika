import express from "express";
const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
    return res.send("server is ready")
})


app.listen(PORT, () => console.log(`server is started at http://localhost:${PORT}`))