const express = require("express");

const app = express();

app.use(express.static(`${__dirname}/build`))

app.listen("8080", () => console.log("Please visit http:localhost:8080 in your browser!"));
