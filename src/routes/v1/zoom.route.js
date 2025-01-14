const express = require('express');
const zoomController = require('../../controllers/zoom.controller');

const router = express.Router();

router.route('/zoom00').post(zoomController.catchGithubEventHook);

module.exports = router;