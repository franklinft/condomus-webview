import express from 'express';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import { mocks } from '../mock/index.mjs';

const app = express();

app.use(express.json({ limit: '2mb' }));
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', request.headers.origin || '*');
    response.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Accept, Authorization, correlationId, flowId',
    );
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (request.method === 'OPTIONS') {
        return response.sendStatus(204);
    }

    return next();
});

app.use(async (request, response) => {
    const rel = request.path;

    const handler = mocks[rel];

    if (!handler) {
        return response.status(404).json({
            error: 'Endpoint not found'
        });
    }

    const result = await handler({
        method: request.method,
        rel,
        headers: {
            ...request.headers,
            origin: request.headers.origin,
        },
        body: request.method === 'GET' ? request.query : request.body,
    });

    return response.json(result);
});

const isHttps = process.env.MOCK_HTTPS === 'true';
const server = isHttps
    ? https.createServer({
        key: fs.readFileSync('certificates/local-key.pem'),
        cert: fs.readFileSync('certificates/local-cert.pem'),
    }, app)
    : http.createServer(app);

server.listen(isHttps ? 9001 : 9000, '0.0.0.0', () => {
    console.log(
        `Mock server running on ${isHttps ? 'https' : 'http'}://0.0.0.0:${isHttps ? 9001 : 9000}`,
    );
});
