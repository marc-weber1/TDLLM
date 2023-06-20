import { spawn } from 'child_process';
import { promisify } from 'util';


const setTimeoutPromise = promisify(setTimeout);

const allowedImages = [
    'node:18-alpine',
    'mocha:latest',
    'nodeserver:latest'
];


async function kill_pod(pod_name){
    console.log('Killing ' + pod_name);
    const killp = spawn('podman', ['pod', 'rm', '-f', '-t=0', pod_name], {
        stdio: 'pipe'
    });
    let stdout = '', stderr = '';

    let killPromise = new Promise((resolveFunc) => {
        killp.stdout.on("data", data => {
            stdout += data.toString();
        });
        killp.stderr.on("data", data => {
            stderr += data.toString();
        });
        killp.on("exit", (exit_code) => {
            resolveFunc(exit_code);
        });
    });

    let exit_code = await killPromise;
    console.log(stdout);

    return exit_code;
}

// Uses MEMORY_LIMIT (e.g. 256m - https://docs.podman.io/en/latest/markdown/podman-run.1.html#memory-m-number-unit) and TIME_LIMIT (in ms)
async function run_podman(code, image, pod_name = 'new'){
    // Restrict the image to the allowed ones to avoid DoS and prevent injection
    if(!allowedImages.includes(image)){
        throw new Error('Invalid image. Allowed images: ' + allowedImages.join(', '));
    }

    // Create a random pod name if it's new
    if(pod_name === 'new'){
        pod_name = 'new:' + Math.random().toString(36).substring(2);
    }

    // Spawn the podman image with a piped stdin, stdout, and stderr
    const podman = spawn('podman', ['run', '--pod=' + pod_name, '--rm', '-m', process.env.MEMORY_LIMIT, '-i', image], {
        stdio: 'pipe'
    });

    // Send the code to the child process's stdin
    podman.stdin.write(code);
    podman.stdin.end();

    // Collect any output from the child process's stdout and stderr
    let stdout = '';
    let stderr = '';
    let podmanPromise = new Promise((resolveFunc) => {
        podman.stdout.on("data", data => {
            stdout += data.toString();
        });
        podman.stderr.on("data", data => {
            stderr += data.toString();
        });
        podman.on("exit", (exit_code) => {
            resolveFunc(exit_code);
        });
    });

    // Wait for the child process to exit, or kill it if it runs for too long
    const timeout = setTimeoutPromise(process.env.TIME_LIMIT).then(async () => {
        console.log("TIMEOUT");
        await kill_pod(pod_name.replace('new:', ''));
        throw new Error('Execution timed out');
    });
    const exit_code = await Promise.race([
        podmanPromise,
        timeout
    ]);
    //await kill_pod();

    return {stdout, stderr, exit_code, pod_name: pod_name.replace('new:', '')};
}

function run_server_podman(code, image, pod_name = 'new'){
    // Restrict the image to the allowed ones to avoid DoS and prevent injection
    if(!allowedImages.includes(image)){
        throw new Error('Invalid image. Allowed images: ' + allowedImages.join(', '));
    }

    // Create a random pod name if it's new
    if(pod_name === 'new'){
        pod_name = 'new:' + Math.random().toString(36).substring(2);
    }

    // Spawn the podman image with a piped stdin, stdout, and stderr
    const podman = spawn('podman', ['run', '--pod=' + pod_name, '--rm', '-m', process.env.MEMORY_LIMIT, '-i', image], {
        stdio: 'pipe'
    });

    // Send the code to the child process's stdin
    podman.stdin.write(code);
    podman.stdin.end();

    return {process: podman, pod_name: pod_name.replace('new:', '')}
}


export { run_podman, run_server_podman, kill_pod };