import express from 'express';

import { run_podman } from './controllers/podman.js';
import { generate_code_with_tests } from './controllers/openai.js'


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

router.post('/generate', async (req, res) => {
    try{
        console.log(req.body);
        const image = req.body.image;
        const prompt = req.body.prompt;
        const tests = req.body.tests;

        const resp = await generate_code_with_tests(image, prompt, tests);
        res.json(resp);
    }
    catch(err){
        console.error(JSON.stringify(err, 0, 2));
        res.status(500).send({error: err.message});
    }
});

export default router;