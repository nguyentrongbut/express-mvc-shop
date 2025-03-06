const express = require('express');
const router = express.Router();

const controller = require("../../controllers/admin/auth.controller");

router.get('/signIn', controller.signIn);
router.post('/signIn', controller.signInPost);
router.post('/refresh-token', controller.refreshToken);
router.get('/logout', controller.logout);

module.exports = router;