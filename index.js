import express from 'express';
import dotenv from 'dotenv';

import routes from './src/routes.js';

dotenv.config();
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use('/', routes);

app.listen(80, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:80`)
});