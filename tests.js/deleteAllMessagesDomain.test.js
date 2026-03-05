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
    console.log(`Found ${resp.result.msgs.length} message summaries for domain ${domain}`);
});

test('Delete all messages for a domain', async () => {
    const resp = await client.request(new DeleteDomainMessagesRequest(domain));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.equal(resp.result.status, 'ok', `Expected result status to be 'ok', got ${resp.result.status}`);
    assert.ok(resp.result.count > 0, `Expected at least one message to be deleted, got ${resp.result.count}`);
    console.log(`Deleted ${resp.result.count} messages from domain ${domain}`);
});

// Wait a moment to ensure that the deletions have propagated before fetching the inbox again
await new Promise(resolve => setTimeout(resolve, 2000));

test('Get all messages summaries for a domain and assert none exist', async () => {
    const resp = await client.request(new GetInboxRequest(domain));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.equal(resp.result.msgs.length, 0, 'Expected no message summaries for the domain');
});