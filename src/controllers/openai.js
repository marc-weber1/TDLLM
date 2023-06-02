import { Configuration, OpenAIApi} from 'openai';

import { run_podman } from './podman.js';


// Uses MAX_ITERATIONS (number of times it tries to gen), OPENAI_MODEL (e.g. gpt-3.5-turbo), and OPENAI_KEY
async function generate_code_with_tests(image, prompt, tests){

    const ai_configuration = new Configuration({
        apiKey: process.env.OPENAI_KEY,
    });
    const openai = new OpenAIApi(ai_configuration);

    var messages = [
        {
            "role": "system",
            "content": "You are a code generator that only generates code that can be parsed by a NodeJS runtime with no errors, and all plain language must be in comments. You write clean, organized code with helpful comments that can be understood by non-programmers."
        },
        {
            "role": "user",
            "content": prompt
        }
    ];

    for(let iterations=1; iterations<=process.env.MAX_ITERATIONS; iterations++){ // Loop until it compiles & passes all tests

        // Generate prompt with chatgpt

        const ai_response = await openai.createChatCompletion({
            model: process.env.OPENAI_MODEL,
            messages
        });
        console.log({result: ai_response.data.choices[0].message.content});
        var code = ai_response.data.choices[0].message.content;


        // Try running the code

        const [stdout, stderr, exit_code] = await run_podman(code, image);

        if( exit_code != 0 ){
            messages.push({
                "role": "assistant",
                "content": code
            });
    
            messages.push({
                "role": "user",
                "content": "I get the following error: " + stderr
            });

            continue;
        }


        // Try running tests on the code

        const tests_with_vars = // Does JSON stringify prevent injection?
            `const stdout = ${JSON.stringify(stdout)}
             const stderr = ${JSON.stringify(stderr)}
             const exit_code = ${exit_code}
            ` + tests;
        const [test_stdout, test_stderr, test_exit_code] = await run_podman(tests_with_vars, 'mocha:latest');

        console.log({test_stdout, test_stderr, test_exit_code});

        if(test_exit_code != 0){
            messages.push({
                "role": "assistant",
                "content": code
            });
    
            messages.push({
                "role": "user",
                "content": "This fails the following tests: " + stderr
            });

            continue;
        }


        return {code, stdout, stderr, exit_code, iterations};
    }

    throw new Error("Max iterations exceeded.");
}


export { generate_code_with_tests };