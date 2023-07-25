import express from "express";

import { PodmanSandbox } from "./controllers/podman";
import {
  generate_program_with_tests,
  generate_server_with_tests,
} from "./controllers/orchestrator";

const router = express.Router();

router.post("/run", async (req, res) => {
  try {
    req.log.debug({body: req.body});
    const code = req.body.code;
    const image = req.body.image;

    let sandbox = new PodmanSandbox();
    const process_info = sandbox.add_process(code, image);
    const timeout_info = sandbox.add_timeout(+process.env.TIME_LIMIT!);
    const exit_code = await sandbox.race();

    req.log.debug({process_info});
    res.json(process_info);
  } catch (err: any) {
    req.log.error(err);
    res.status(500).send({ error: err.message });
  }
});

router.post("/generate_and_test", async (req, res) => {
  try {
    req.log.debug({body: req.body});
    const prompt = req.body.prompt;
    const tests = req.body.tests;

    const resp = await generate_program_with_tests(prompt, tests, req.log);
    res.json(resp);
  } catch (err: any) {
    req.log.error(err);
    res.status(500).send({ error: err.message });
  }
});

router.post("/generate_server_and_test", async (req, res) => {
  try {
    req.log.debug({body: req.body});
    const prompt = req.body.prompt;
    const tests = req.body.tests;

    const resp = await generate_server_with_tests(prompt, tests, req.log);
    res.json(resp);
  } catch (err: any) {
    req.log.error(err);
    res.status(500).send({ error: err.message });
  }
});

export default router;
