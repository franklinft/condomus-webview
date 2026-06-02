import express from 'express';
import { mocks } from '../mock/index.mjs';

const app = express();

app.use(express.json());

app.use(async (request, response) => {
    const rel = request.path.replace(/^\//, '');

    const handler = mocks[rel];

    if (!handler) {
        return response.status(404).json({
            error: 'Endpoint not found'
        });
    }

    const result = await handler();

    return response.json(result);
});

app.listen(9000, () => {
    console.log('Mock server running on http://localhost:9000');
});
