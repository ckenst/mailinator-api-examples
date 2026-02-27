import { before, test } from 'node:test';
import assert from 'node:assert/strict';
import mailinatorClient from 'mailinator-client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const {
    MailinatorClient,
    PostMessageRequest,
    MessageToPost,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const domain = process.env.MAILINATOR_RULES_DOMAIN;
let client;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');

    client = new MailinatorClient(apiToken);
});

test('Create a message for an inbox', async () => {
    const inbox = `auto-inbox-${Date.now()}`;
    const requestBody = new MessageToPost(
        'API Test Email',
        'sender@example.com',
        'This is the body of the injected message.',
    );

    const resp = await client.request(new PostMessageRequest(domain, inbox, requestBody));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
});

test('Delete all messages for a domain', async () => {
    // delete all messages for that domain
});

test('Get all messages summaries for a domain and assert none exist', async () => {
    // get all messages for that domain and assert that there are none
});