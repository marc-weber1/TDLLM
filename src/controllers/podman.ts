import { spawn } from "child_process";
import { promisify } from "util";
import { runInThisContext } from "vm";

const setTimeoutPromise = promisify(setTimeout);

const allowedImages = ["node:18-alpine", "mocha:latest", "nodeserver:latest"];

class PodmanSandbox {
  processes: Process[];
  pod_name: any;

  constructor() {
    this.processes = [];
  }

  add_process = (code: string, image: string) => {
    // Restrict the image to the allowed ones to avoid DoS and prevent injection
    if (!allowedImages.includes(image))
      throw new Error("Invalid image. Allowed images: " + allowedImages.join(", "));

    let pod_name = this.pod_name;
    // Create a random pod name if it's new
    if (!this.pod_name) {
      this.pod_name = Math.random().toString(36).substring(2);
      pod_name = "new:" + this.pod_name;
    }

    // Spawn the podman image with a piped stdin, stdout, and stderr
    const podman = spawn(
      "podman",
      ["run", "--pod=" + pod_name, "--rm", "-m", process.env.MEMORY_LIMIT!, "-i", image],
      {
        stdio: "pipe",
      }
    );

    // Send the code to the child process's stdin
    podman.stdin.write(code);
    podman.stdin.end();

    const process_index = this.processes.length;

    // Collect any output from the child process's stdout and stderr
    let promise: Promise<number> = new Promise((resolveFunc) => {
      podman.stdout.on("data", (data) => {
        this.processes[process_index].stdout += data.toString();
      });
      podman.stderr.on("data", (data) => {
        this.processes[process_index].stderr += data.toString();
      });
      podman.on("exit", (exit_code) => {
        this.processes[process_index].exit_code = exit_code ?? -1;
        //console.log(JSON.stringify(this.processes[process_index], 0, 2));
        resolveFunc(exit_code ?? -1);
      });
    });

    this.processes.push({ promise, stdout: "", stderr: "", exit_code: 0 });
    return this.processes[process_index];
  };

  add_timeout(ms: number) {
    let stdout = "",
      stderr = "",
      exit_code = 0;

    const promise = setTimeoutPromise(+process.env.TIME_LIMIT!).then(async () => {
      stdout += "TIMEOUT\n";
      let kill_process = await this.kill();
      stdout += kill_process.stdout;
      stderr += kill_process.stderr;
      exit_code = kill_process.exit_code;

      throw new Error("Execution timed out");
    });

    this.processes.push({ promise, stdout, stderr, exit_code });
    return { stdout, stderr, exit_code };
  }

  kill = async (): Promise<ProcessResult> => {
    console.log("Killing " + this.pod_name);
    const killp = spawn("podman", ["pod", "rm", "-f", "-t=0", this.pod_name], {
      stdio: "pipe",
    });
    let stdout = "",
      stderr = "";

    let promise: Promise<number> = new Promise((resolveFunc) => {
      killp.stdout.on("data", (data) => {
        stdout += data.toString();
      });
      killp.stderr.on("data", (data) => {
        stderr += data.toString();
      });
      killp.on("exit", (exit_code) => {
        resolveFunc(exit_code ?? -1);
      });
    });

    let exit_code = await promise;

    return { stdout, stderr, exit_code };
  };

  race = async () => {
    console.log(JSON.stringify(this.processes));
    const exit_code = await Promise.race(this.processes.map((p) => p.promise));
    await this.kill();
    return exit_code;
  };
}

export { PodmanSandbox };
