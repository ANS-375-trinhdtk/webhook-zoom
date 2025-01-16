const ApiError = require('../utils/ApiError');
const config = require('../config/config');
const httpStatus = require('http-status');

const verifySignatureWebhook = () => async (req, res, next) => {
    const requestData = req.body;
    const requestHeaders = req.headers;
    let isValid = await verifySignature(config.github00.secret, requestHeaders['x-hub-signature-256'], JSON.stringify(requestData));

    if(!isValid) {
        return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid signature'));
    }
    return next();
}

let encoder = new TextEncoder();
async function verifySignature(secret, header, payload) {
    let parts = header.split("=");
    let sigHex = parts[1];

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

module.exports = verifySignatureWebhook;