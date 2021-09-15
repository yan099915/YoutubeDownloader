const express = require("express");

const router = require("./routes/index");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router.mainRouter);
// app.use(router.dataRouter);
// app.use(router.todoRouter);

module.exports = app;
