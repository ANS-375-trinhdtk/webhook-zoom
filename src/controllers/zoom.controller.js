const config = require('../config/config');
const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');

const catchGithubEventHook = catchAsync(async (req, res) => {
    const requestData = req.body;
    const requestHeaders = req.headers;
    let isValid = await verifySignature(config.github00.secret, requestHeaders['x-hub-signature-256'], JSON.stringify(requestData));
    console.log("isValid: ", isValid);
    console.log("secret: ", config.github00.secret);
    console.log("signature: ", requestHeaders['x-hub-signature-256']);

    if(!isValid) {
        res.status(403).send('Invalid signature 403');
        return;
    }
    // Call another API
    const response = await axios.post(config.zoom00.url, requestData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.zoom00.token
        }
    });

    res.status(response.status).send(response.data);
});

let encoder = new TextEncoder();

async function verifySignature(secret, header, payload) {
    console.log("START VERIFY SIGNATURE");
    let parts = header.split("=");
    let sigHex = parts[1];
    console.log("sigHex: ", sigHex);

    let algorithm = { name: "HMAC", hash: { name: 'SHA-256' } };

    let keyBytes = encoder.encode(secret);
    let extractable = false;
    let key = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        algorithm,
        extractable,
        [ "sign", "verify" ],
    );

    let sigBytes = hexToBytes(sigHex);
    let dataBytes = encoder.encode(payload);
    let equal = await crypto.subtle.verify(
        algorithm.name,
        key,
        sigBytes,
        dataBytes,
    );

    console.log("END VERIFY SIGNATURE");
    return equal;
}

function hexToBytes(hex) {
    let len = hex.length / 2;
    let bytes = new Uint8Array(len);

    let index = 0;
    for (let i = 0; i < hex.length; i += 2) {
        let c = hex.slice(i, i + 2);
        let b = parseInt(c, 16);
        bytes[index] = b;
        index += 1;
    }

    return bytes;
}

module.exports = {
    catchGithubEventHook
};