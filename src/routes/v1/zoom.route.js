const express = require('express');
const zoomController = require('../../controllers/zoom.controller');
const verifySignatureWebhook = require('../../middlewares/verifySignatureWebhook');

const router = express.Router();

router.route('/zoom00').post(verifySignatureWebhook(), zoomController.catchGithubEventHook);

module.exports = router;