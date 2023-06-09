import { run_podman } from './podman.js';
import { generate } from './openai.js';


// Uses MAX_ITERATIONS (number of times it tries to gen)
async function generate_code_with_tests(image, prompts, tests){

    var messages = [...prompts]; // Copy the array


    for(let iterations=1; iterations<=process.env.MAX_ITERATIONS; iterations++){ // Loop until it compiles & passes all tests

        // Generate code with chatgpt

        var code = await generate(messages);


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