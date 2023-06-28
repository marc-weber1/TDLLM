interface ProcessResult {
  stdout: string;
  stderr: string;
  exit_code: number;
}

interface Process {
  promise: Promise<number>;
  stdout: string;
  stderr: string;
  exit_code: number;
}
