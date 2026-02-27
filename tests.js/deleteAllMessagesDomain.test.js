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
    DeleteDomainMessagesRequest,
    GetInboxRequest,
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

test('Get all messages summaries for a domain and assert at least 1 exists', async () => {
    const resp = await client.request(new GetInboxRequest(domain));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.msgs.length > 0, 'Expected at least one message summary for the domain');
});

test('Delete all messages for a domain', async () => {
    const resp = await client.request(new DeleteDomainMessagesRequest(domain));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
});

test('Get all messages summaries for a domain and assert none exist', async () => {
    const resp = await client.request(new GetInboxRequest(domain));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.equal(resp.result.msgs.length, 0, 'Expected no message summaries for the domain');
});