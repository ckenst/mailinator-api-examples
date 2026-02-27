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
    GetMessageRequest,
    DeleteMessageRequest,
} = mailinatorClient;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

let client;
let domain;
let inbox;
let createdMessageId;
let expectedBody;

before(() => {
    const apiToken = process.env.MAILINATOR_API_TOKEN;
    domain = process.env.MAILINATOR_RULES_DOMAIN;

    assert.ok(apiToken, 'MAILINATOR_API_TOKEN is not defined in .env');
    assert.ok(domain, 'MAILINATOR_RULES_DOMAIN is not defined in .env');

    client = new MailinatorClient(apiToken);
    inbox = `auto-inbox-${Date.now()}`;
    expectedBody = `Delete specific message test body ${Date.now()}`;
});

test('Create a message for an inbox', async () => {
    const requestBody = new MessageToPost(
        'Delete specific message test',
        'sender@example.com',
        expectedBody,
    );

    const resp = await client.request(new PostMessageRequest(domain, inbox, requestBody));

    assert.ok(resp, 'Response should not be null');
    assert.equal(resp.statusCode, 200, `Expected status code 200, got ${resp.statusCode}`);
    assert.ok(resp.result.id, 'Created message response should include id');

    createdMessageId = resp.result.id;
});

test('Get a message from an inbox', async () => {
    assert.ok(createdMessageId, 'Message id should be set by the create-message test');

    const messageResp = await client.request(new GetMessageRequest(domain, createdMessageId));

    assert.ok(messageResp, 'Get message response should not be null');
    assert.equal(messageResp.statusCode, 200, `Expected status code 200, got ${messageResp.statusCode}`);
    assert.equal(messageResp.result.text, expectedBody, 'Fetched message body should match created message body');
});

test('Delete a message from an inbox', async () => {
    assert.ok(createdMessageId, 'Message id should be set by the create-message test');

    const deleteResp = await client.request(new DeleteMessageRequest(domain, inbox, createdMessageId));

    assert.ok(deleteResp, 'Delete message response should not be null');
    assert.equal(deleteResp.statusCode, 200, `Expected status code 200, got ${deleteResp.statusCode}`);
});

test('Get a message from an inbox and assert that it is deleted', async () => {
    assert.ok(createdMessageId, 'Message id should be set by the create-message test');

    let fetchError;

    try {
        await client.request(new GetMessageRequest(domain, createdMessageId));
    } catch (error) {
        fetchError = error;
    }

    assert.ok(fetchError, 'Expected fetching deleted message to fail');
    assert.equal(fetchError.statusCode, 500, `Expected status code 500, got ${fetchError.statusCode}`);
});