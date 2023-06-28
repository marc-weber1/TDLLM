import { writable } from 'svelte/store';

export const code_runtab = writable("// Importing the Node.js built-in 'crypto' module for cryptographic functionality\nconst crypto = require('crypto');\n\n// Defining the number of bits for the RSA key\nconst numBits = 2048;\n\n// Generating the RSA key pair with cryptographically secure randomness\ncrypto.generateKeyPair('rsa', {\n  modulusLength: numBits,\n  publicKeyEncoding: { type: 'pkcs1', format: 'pem' },\n  privateKeyEncoding: { type: 'pkcs1', format: 'pem', cipher: 'aes-256-cbc', passphrase: 'mySecretPassphrase' }\n}, (err, publicKey, privateKey) => {\n  if (err) {\n    console.error(`Error occurred while generating RSA key pair: ${err.message}`);\n    return;\n  }\n  \n  console.log('RSA key pair has been successfully generated:');\n  console.log(`Public key:\\n${publicKey}\\n`);\n  console.log(`Private key (with passphrase):\\n${privateKey}\\n`);\n});\n\n// Note to non-programmers: \n// This program generates an RSA private key with 2048 bits, which is a widely accepted standard for secure key length. The cryptographic functionality is provided by the Node.js built-in 'crypto' module. The generated key pair consists of a public key and a private key. The public key can be freely shared with others, while the private key should be kept secret. Additionally, the private key is encrypted with advanced encryption algorithm 'aes-256-cbc' and a secret passphrase 'mySecretPassphrase' for enhanced security.");
export const test_code_clitab = writable("const crypto = require('crypto');\nconst assert = require('assert');\n\nconst hash = crypto.createHash('sha256');\n\nit('Should generate the hash correctly', async function() {\n    var result = await run('bananas');\n    assert( result.stdout.trim() == hash.update('bananas').digest('hex') );\n});");
export const prompt_clitab = writable("Write me a program that generates me a hash of the string provided in the first commandline argument. The string should be encoded in UTF-8, and the hash should be printed to the console as hex code.");
export const test_code_apitab = writable("const path = require('path');\nconst assert = require('assert');\nconst axios = require('axios');\n\nit('multiplies 6 correctly', () => {\n    axios.post(path.join(server_uri, 'multiply'), {\n        number: 6\n    })\n    .then(function (response) {\n        assert( response.data.number == 12 );\n    })\n});");
export const prompt_apitab = writable("Write an expressJS api with a POST endpoint /multiply that takes a body like {'number': 3} and returns a number two times the one given, like {'number': 6}. It should listen on port 80.");

export const stdout_runtab = writable("");
export const stderr_runtab = writable("");
export const exit_code_runtab = writable(0);

export const generated_code_clitab = writable("");
export const stdout_clitab = writable("");
export const stderr_clitab = writable("");
export const exit_code_clitab = writable(0);
export const iterations_clitab = writable(0);

export const generated_code_apitab = writable("");
export const server_stdout_apitab = writable("");
export const server_stderr_apitab = writable("");
export const server_exit_code_apitab = writable(0);
export const test_stdout_apitab = writable("");
export const test_stderr_apitab = writable("");
export const test_exit_code_apitab = writable(0);
export const iterations_apitab = writable(0);