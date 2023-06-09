import express from 'express';

import { run_podman } from './controllers/podman.js';
import { generate_code_with_tests } from './controllers/orchestrator.js'


const router = express.Router();

router.post('/run', async (req, res) => {
    try {
        console.log(req.body);
        const code = req.body.code;
        const image = req.body.image;

        const [stdout, stderr, exit_code] = await run_podman(code, image);
        
        console.log({ stdout, stderr, exit_code });
        res.json({ stdout, stderr, exit_code });
    }
    catch (err) {
        console.error(err);
        res.status(500).send({error: err.message});
    }
});

router.post('/generate_and_test', async (req, res) => {
    try{
        console.log(req.body);
        const image = req.body.image;
        const prompts = req.body.prompts;
        const tests = req.body.tests;

        const resp = await generate_code_with_tests(image, prompts, tests);
        res.json(resp);
    }
    catch(err){
        console.error(err);
        res.status(500).send({error: err.message});
    }
});

export default router;