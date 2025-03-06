const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/auth.controller");

router.get('/signIn', controller.signIn);
router.post('/signIn', controller.signInPost);
router.post('/refresh-token', controller.refreshToken)
router.get('/signUp', controller.signUp)
router.post('/signUp', controller.signUpPost)
router.get('/logout', controller.logout)

module.exports = router;