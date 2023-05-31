import express from 'express';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
})

app.listen(80, '0.0.0.0', () => {
    console.log(`Server listening at http://localhost:80`)
});