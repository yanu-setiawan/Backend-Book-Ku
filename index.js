require("dotenv").config();
const cors = require("cors");
const express = require("express");

// create express application
const app = express();
app.use(cors());

const { serverPort } = require("./src/configs/environment");
const PORT = serverPort || 8080;

// parser untuk body
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true })); // form-urlencoded
app.use(express.json()); // raw json
// body akan dimasukkan ke req.body

app.use("/images", express.static("images"));

const morgan = require("morgan");
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

const masterRouter = require("./src/routers");
app.use(masterRouter);

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
});

module.exports = app;
