## What is this?

TDLLM is an API that helps an LLM write code based on a prompt, and a series of tests made in mochaJS that the code has to pass.

The API and tests will run in a sandbox, so the endgoal is an API that can be safely called by users that should not have access to the server itself, even if the server is run by root/a sudoer. That said, please run the server as its own user for safety.

Please report ANY vulnerabilities or attack vectors to the github issues, or my DMs if they are severe.

## Program Mode

Generate a program, and test it by running it with certain commandline arguments.

```
POST /generate_and_test
{
    "prompt": "Write me a program that generates me a hash of the string provided in the first commandline argument. The string should be encoded in UTF-8, and the hash should be printed to the console as hex code.",

    "tests": `

        const crypto = require('crypto');
        const assert = require('assert');

        const hash = crypto.createHash('sha256');

        it('Should generate the hash correctly', async function() {
            var result = await run('bananas');
            assert( result.stdout.trim() == hash.update('bananas').digest('hex') );
        });

    `
}
```

## Server mode

Use the server endpoint if you need to generate APIs instead, e.g. an ExpressJS API, and test it over the network.

```
POST /generate_server_and_test
{
    "prompt": "Write me an expressJS api with a POST endpoint /multiply that takes a body like {'number': 3} and returns a number two times the one given, like {'number': 6}.",

    "tests": `

        const path = require('path');
        const assert = require('assert');
        const axios = require('axios');

        it('multiplies 6 correctly', () => {
            axios.post(path.join(server_uri, 'multiply'), {
                number: 6
            })
            .then(function (response) {
                assert( response.data.number == 12 );
            })
        });

    `
}
```

## Setup

Install podman and nodeJS. Make a .env file with these variables:

```
PORT=80
MEMORY_LIMIT=256m
TIME_LIMIT=10000
MAX_ITERATIONS=10
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_KEY=...
```

or include them in your environment.

Run:

```
podman build -t mocha -f mocha.dockerfile
podman build -t nodeserver -f server.dockerfile
node server.js
```

## Available test variables (program mode)

`run(arg1, [arg2, ...]) -> { stdout, stderr, exit_code }`

## Available test variables (server mode)

`server_uri: string`
