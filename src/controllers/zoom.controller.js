const config = require('../config/config');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');

const catchGithubEventHook = catchAsync(async (req, res) => {
    const requestData = req.body;

    // Call another API
    const response = await axios.post(config.zoom00.url, requestData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.zoom00.token
        }
    });

    res.status(response.status).send(response.data);
});

module.exports = {
    catchGithubEventHook
};