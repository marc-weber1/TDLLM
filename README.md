## What is this?

TDLLM is an API that helps an LLM write code based on a prompt, and a series of tests made in mochaJS that the code has to pass. An example API call would look like this:
```
{
    "image": "node:18-alpine",

    "prompt": "Write me a program that generates me a hash of the string 'bananas'. The string should be encoded in UTF-8, and the hash should be printed to the console as hex code.",

    "tests": """

        const {
            createHash,
        } = await import('node:crypto');

        const hash = createHash('sha256');

        it('Should generate the hash correctly', function() {
            assert( stdout.trim() == hash.update('bananas').digest('hex') );
        });

    """
}
```
The API and tests will run in a sandbox, so the endgoal is an API that can be safely run by users that should not have access to the server itself, even if the server is run by root/a sudoer. That said, please run the server as its own user for safety.

Please report ANY vulnerabilities or attack vectors to the github issues, or my DMs if they are severe.

## Setup

Install podman. Make a .env file with these variables:
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
node index.js
```

## Available test variables

stdout

stderr

exit_code