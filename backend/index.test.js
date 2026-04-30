import {
    describe,
    it,
    expect,
    beforeAll,
    afterAll
} from 'vitest';
import express from 'express';
import {
    createServer
} from 'node:http';

const fakeRequiresAuth = (req, res, next) => {
    if (!req.headers['x-test-user']) {
        return res.status(401).json({
            error: 'Not authenticated'
        });
    }
    req.oidc = {
        user: {
            name: 'Ada',
            email: 'ada@test.com'
        }
    };
    next();
};

const app = express();
app.use(express.json());

app.get('/profile', fakeRequiresAuth, (req, res) => {
    res.json(req.oidc.user);
});

app.get('/secure-data', fakeRequiresAuth, (req, res) => {
    res.json({
        message: 'This is protected data',
        user: req.oidc.user
    });
});

let server;
let baseUrl;

beforeAll(() => {
    server = createServer(app);
    server.listen(0);
    const {
        port
    } = server.address();
    baseUrl = `http://localhost:${port}`;
});

afterAll(() => server.close());

describe('GET /profile', () => {
    it('returns 401 when the user is not logged in', async () => {
        const res = await fetch(`${baseUrl}/profile`);
        expect(res.status).toBe(401);
    });

    it('returns user data when the user is logged in', async () => {
        const res = await fetch(`${baseUrl}/profile`, {
            headers: {
                'x-test-user': 'true'
            },
        });
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.email).toBe('ada@test.com');
    });
});

describe('GET /secure-data', () => {
    it('returns 401 when the user is not logged in', async () => {
        const res = await fetch(`${baseUrl}/secure-data`);
        expect(res.status).toBe(401);
    });

    it('returns protected data when the user is logged in', async () => {
        const res = await fetch(`${baseUrl}/secure-data`, {
            headers: {
                'x-test-user': 'true'
            },
        });
        const data = await res.json();
        expect(res.status).toBe(200);
        expect(data.message).toMatch(/protected data/i);
    });
});