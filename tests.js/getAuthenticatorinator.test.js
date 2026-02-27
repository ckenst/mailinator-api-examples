import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    InstantTOTP2FACodeRequest,
    GetAuthenticatorsRequest,
    GetAuthenticatorsByIdRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let secretKey;
let authenticatorId;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    secretKey = process.env.AUTHENTICATORINATOR_SECRET_KEY;
    authenticatorId = process.env.AUTHENTICATORINATOR_ID;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(secretKey, 'AUTHENTICATORINATOR_SECRET_KEY is not defined in .env');

    client = new MailinatorClient(apiToken);
});

test('Get instant TOTP codes based on a secret key', async () => {
    const resp = await client.request(new InstantTOTP2FACodeRequest(secretKey));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.passcode, 'Expected passcode value in response');
    assert.equal(resp.result.futurecodes.length, 5, 'Expected exactly 5 future TOTP values');
});

test('Get instant TOTP code based on a stored authenticator ID', async () => {
    assert.ok(authenticatorId, 'AUTHENTICATORINATOR_ID is not defined in .env');

    const resp = await client.request(new GetAuthenticatorsByIdRequest(authenticatorId));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.passcode, 'Expected passcode value in response');
    assert.equal(resp.result.futurecodes.length, 5, 'Expected exactly 5 future TOTP values');
});

test('Get all stored authenticator IDs', async () => {
    assert.ok(authenticatorId, 'AUTHENTICATORINATOR_ID is not defined in .env');

    const resp = await client.request(new GetAuthenticatorsRequest());

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(Array.isArray(resp.result.passcodes), 'Expected passcodes to be an array');

    const returnedIds = resp.result.passcodes.map((item) => item.id);
    assert.ok(
        returnedIds.includes(authenticatorId),
        `Expected authenticator id ${authenticatorId} to be in returned passcodes list`,
    );
});
