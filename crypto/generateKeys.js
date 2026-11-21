import crypto from "crypto";
import fs from "fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048, //256bytes
    privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
    },
    publicKeyEncoding: {
        type: "spki",
        format: "pem",
    },
});

fs.writeFileSync("certs/privateKey.pem", privateKey);
fs.writeFileSync("certs/publicKey.pem", publicKey);
