require("dotenv").config()
const express = require('express');
const database = require("./config/database")

database.connect()

const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})