import { PodmanSandbox } from './podman.js';
import { generate } from './openai.js';


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Uses MAX_ITERATIONS (number of times it tries to gen)
async function generate_program_with_tests(prompt, tests){

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

        // Generate code with chatgpt

        let generated_code = await generate(messages);


        // Define the function that runs a process inside the container

        let code = `
        const { spawn } = require('child_process');
        let generated_code = ` + JSON.stringify(generated_code) + `

        async function run(){
            // Spawn the process with a piped stdin, stdout, and stderr
            const process = spawn('node', ['-', ...arguments], {  // Use arguments from function, use - to pass stdin as code
                stdio: 'pipe'
            });

            // Send the code to the child process's stdin
            process.stdin.write(generated_code);
            process.stdin.end();

            // Collect any output from the child process's stdout and stderr
            let stdout = '';
            let stderr = '';
            let processPromise = new Promise((resolveFunc) => {
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

            let exit_code = await processPromise;

            console.log(stdout);
            console.log(stderr);

            return { stdout, stderr, exit_code };
        }
        ` + tests;

        console.log(code);


        // Try running the code

        let sandbox = new PodmanSandbox();
        let test_info = sandbox.add_process(code, 'mocha:latest');
        sandbox.add_timeout(process.env.TIME_LIMIT);
        let exit_code = await sandbox.race();

        console.log(test_info);

        if( exit_code != 0 ){
            messages.push({
                "role": "assistant",
                "content": code
            });

            messages.push({
                "role": "user",
                "content": "I get the following error: " + test_info.stdout
            });

            await sleep(1000);
            continue;
        }

        return {code: generated_code, test_info, iterations};
    }

    throw new Error("Max iterations exceeded.");
}

async function generate_server_with_tests(prompt, tests){

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

        // Generate code with chatgpt
        let generated_code = await generate(messages);

        // Run code in a new server
        let sandbox = new PodmanSandbox();
        let server_info = sandbox.add_process(generated_code, "nodeserver:latest");
        let test_code = `
            let server_uri='http:////localhost'
        ` + tests;
        await sleep(1000); // Wait for server to start
        let test_info = sandbox.add_process(test_code, 'mocha:latest');
        sandbox.add_timeout(process.env.TIME_LIMIT);
        let exit_code = await sandbox.race();
        
        console.log("server: " + JSON.stringify(server_info, 0, 2));
        console.log("tests: " + JSON.stringify(test_info, 0, 2));

        if(exit_code != 0){
            // Feed error to AI, run it again
            let errors = test_info.stderr;
            if(server_info.stderr != '') errors = server_info.stderr;

            messages.push({
                role: "assistant",
                content: generated_code
            });

            messages.push({
                role: "user",
                content: "I get the following error: " + errors
            });

            continue;
        }
        
        return {code: generated_code, server_info, test_info, iterations};

    }
}


export { generate_program_with_tests, generate_server_with_tests };