const express = require('express');
const zoomController = require('../../controllers/zoom.controller');
const verifySignatureWebhook = require('../../middlewares/verifySignatureWebhook');
const githubEventTypeFilter = require('../../middlewares/githubEventTypeFilter');
const verifyJwtToken = require('../../middlewares/verifyJwtToken');

const router = express.Router();

router.route('/zoom00').post(verifySignatureWebhook(), githubEventTypeFilter(), zoomController.catchGithubEventHook);
router.route('/zoom01').post(verifyJwtToken(), zoomController.reportErrorBackend);

module.exports = router;