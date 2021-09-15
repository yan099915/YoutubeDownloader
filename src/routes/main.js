// DEPENDENCIES
require("dotenv").config();
const router = require("express").Router();
/* ----------------------- */
const controllers = require("../controllers/main");

// USER
router.get("/", controllers.main);
router.get("/data", controllers.data);

module.exports = router;
