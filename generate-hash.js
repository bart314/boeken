const crypto = require('crypto')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config({ path: path.resolve('./.env') });
const file = process.argv[2]
console.log(file)
if (file == undefined) {
  console.error("Usage: generate-hash.js <filename>") 
  process.exit()
}

// Retrieve secret from .env
const secret = process.env.SECRET_KEY;
if (!secret) {
  console.error("SECRET_KEY not set in .env");
  process.exit(1);
}

// compute HMAC
const sig = crypto
  .createHmac("sha256", secret)
  .update(file)
  .digest("hex");

console.log("Node.js sig:", sig);
