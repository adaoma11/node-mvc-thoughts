const express = require("express");
const router = express.Router();
const thoughtController = require("../controllers/ThoughtController");

// Helpers
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, thoughtController.createthought);
router.post("/add", checkAuth, thoughtController.createthoughtSave);
router.get("/dashboard", checkAuth, thoughtController.dashboard);
router.get("/edit/:id", checkAuth, thoughtController.updatethought);
router.post("/edit", checkAuth, thoughtController.updatethoughtSave);
router.post("/remove", checkAuth, thoughtController.removethought);
router.get("/", thoughtController.showthoughts);

module.exports = router;
