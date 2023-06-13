import { run_podman, run_server_podman } from './podman.js';
import { generate } from './openai.js';


// Uses MAX_ITERATIONS (number of times it tries to gen)
async function generate_program_with_tests(image, prompts, tests){

    var messages = [...prompts]; // Copy the array


    for(let iterations=1; iterations<=process.env.MAX_ITERATIONS; iterations++){ // Loop until it compiles & passes all tests

        // Generate code with chatgpt

        var generated_code = await generate(messages);


        // Define the function that runs a process inside the container

        var code = `
        const { spawn } = require('child_process');
        var generated_code = ` + JSON.stringify(generated_code) + `

        async function run(){
            // Spawn the process with a piped stdin, stdout, and stderr
            const process = spawn('node', [...arguments], {  // Use arguments from function
                stdio: 'pipe'
            });

            // Send the code to the child process's stdin
            process.stdin.write(generated_code);
            process.stdin.end();

            // Collect any output from the child process's stdout and stderr
            let stdout = '';
            let stderr = '';
            var processPromise = new Promise((resolveFunc) => {
                process.stdout.on("data", data => {
                    stdout += data.toString();
                });
                process.stderr.on("data", data => {
                    stderr += data.toString();
                });
                process.on("exit", (exit_code) => {
                    resolveFunc(exit_code);
                });
            });

            var exit_code = await processPromise;

            return { stdout, stderr, exit_code };
        }
        ` + tests;

        console.log(code);


        // Try running the code

        const [stdout, stderr, exit_code] = await run_podman(code, 'mocha:latest');

        console.log({stdout, stderr, exit_code});

        if( exit_code != 0 ){
            messages.push({
                "role": "assistant",
                "content": code
            });

            messages.push({
                "role": "user",
                "content": "I get the following error: " + stdout
            });

            continue;
        }

        return {code: generated_code, stdout, stderr, exit_code, iterations};
    }

    throw new Error("Max iterations exceeded.");
}

async function generate_server_with_tests(image, prompts, tests){

    var messages = [...prompts]; // Copy the array


    for(let iterations=1; iterations<=process.env.MAX_ITERATIONS; iterations++){ // Loop until it compiles & passes all tests

        // Generate code with chatgpt
        var generated_code = await generate(messages);

        // Run code in a new server
        var server_info = run_server_podman(generated_code, image);
        
        // Run tests in the same pod as the new server
        var test_code = `
            var server_uri = 'localhost'
        ` + tests;
        var [test_stdout, test_stderr, test_exit_code] = await run_podman(test_code, 'mocha:latest', server_info.pod_name);
        console.log({test_stdout, test_stderr, test_exit_code});

        if(test_exit_code != 0){
            // ...
        }

        return {code: generated_code, test_stdout, test_stderr, test_exit_code, iterations};

    }
}


export { generate_program_with_tests, generate_server_with_tests };