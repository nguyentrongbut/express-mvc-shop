const express = require('express');
const controller = require("../../controllers/admin/dashboard.controller");
const router = express.Router();

router.get('/', controller.dashboard)

module.exports = router;