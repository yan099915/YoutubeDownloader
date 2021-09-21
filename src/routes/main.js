// DEPENDENCIES
require("dotenv").config();
const router = require("express").Router();
/* ----------------------- */
const controllers = require("../controllers/main");

// USER
router.get("/", controllers.main);
router.get("/data", controllers.data);
router.get("/search", controllers.search);

module.exports = router;
