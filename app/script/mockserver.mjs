import express from 'express';
import * as mock from '../mock/index.mjs';

const app = express();
const entrypoints = Object.keys(mock);

app.use(express.json());

app.use((request, response) => {
    const rel = request.path.replace(/^\//, '');
    if (entrypoints.includes(rel)) {
        const handler = mock[rel];
        handler(request, response);
    } else {
        response.status(404).json({ error: 'Endpoint not found' });
    }
});

app.listen(9000, () => {
    console.log('Mock server running on http://localhost:9000');
});
