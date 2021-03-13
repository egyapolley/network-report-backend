const express = require("express");
const router = require("./routes/index");
const mongoose = require("mongoose");
const helmet = require("helmet");
const config = require("config");
const cors = require("cors")

const  db = config.get("db");

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => {
    console.log("MongoDB connected")
    const app = express();
    app.use(helmet());
    app.use(cors())
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    let PORT = config.get("port")
    let HOST = config.get("host")

    app.use(router)

    app.listen(PORT, () => {
        console.log(`Server running in  url : http://${HOST}:${PORT}`)
    })

}).catch(err => {
    console.log("Cannot connect to MongoDB");
    throw err;
});
