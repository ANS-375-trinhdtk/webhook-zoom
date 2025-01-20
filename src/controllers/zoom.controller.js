const config = require('../config/config');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const zoomService = require('../services/zoom.service');

const catchGithubEventHook = catchAsync(async (req, res) => {
    const requestData = req.body;

    const zoomMessage = zoomService.createZoomMessage(requestData);
    // Call another API
    // 
    const response = await axios.post(`${config.zoom00.url}?format=full`, zoomMessage, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.zoom00.token
        }
    });

    res.status(response.status).send(response.data);
});

const reportErrorBackend = catchAsync(async (req, res) => {
    const requestData = req.body;
    const zoomMessage = zoomService.createErrorMessage(requestData);
    
    const response = await axios.post(`${config.zoom00.url}?format=full`, zoomMessage, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.zoom00.token
        }
    });

    res.status(response.status).send(response.data);
});

module.exports = {
    catchGithubEventHook,
    reportErrorBackend
};