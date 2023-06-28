import axios from 'axios';
import { PUBLIC_API_URL } from '$env/static/public';

interface ProcessResult {
    stdout: string,
    stderr: string,
    exit_code: number
};

async function call_api(uri: string, body: any): Promise<any> {
    const res = await axios.post(new URL(uri, PUBLIC_API_URL).href, body, {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
    });
    return res.data;
}

async function run(code: string): Promise<ProcessResult> {
    return await call_api('run', { code, image: "node:18-alpine" });
}

async function generate_cli(test_code: string, prompt: string): Promise<{ generated_code: string, test_info: ProcessResult, iterations: number }>{
    return await call_api('generate_cli', { tests: test_code, prompt });
}

async function generate_api(test_code: string, prompt: string) : Promise<{ generated_code: string, server_info: ProcessResult, test_info: ProcessResult, iterations: number }> {
    return await call_api('generate_api', { tests: test_code, prompt });
}

export { run, generate_cli, generate_api };