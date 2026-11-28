import { readFileSync } from "node:fs";
import { createPublicKey } from "node:crypto";

const pem = readFileSync("./certs/publicKey.pem", "utf-8");
const publicKey = createPublicKey(pem);

const jwk = publicKey.export({ format: "jwk" });
console.log(JSON.stringify(jwk, null, 2));
